/* WhatsApp Blur - content script
 * Tags the parts of WhatsApp Web that leak information (chat-list rows,
 * message bubbles, the conversation header) so content.css can blur them.
 * Hovering the row reveals the name AND the message together.
 */
(() => {
  const DEFAULTS = {
    enabled: true,
    radius: 6,
    blurChatList: true,
    blurConversation: true,
    blurAvatars: false,
    revealMode: 'hover' // 'hover' | 'click'
  };

  let settings = { ...DEFAULTS };
  const root = document.documentElement;

  /* ---------- element hunting ---------------------------------------- */

  // A chat row is [avatar][text column]. Tag names are useless here -
  // WhatsApp obfuscates classes, and emoji are <img> just like avatars, so
  // sniffing for images mistakes an emoji for a profile photo. So: measure
  // the avatar's box, then take the topmost text-bearing element that clears
  // it. Nothing here depends on class names or on which side things sit.
  function avatarBox(item, rect) {
    // Breadth-first, so the outermost match wins: the avatar is the first
    // roughly-square box in the row big enough to be a photo. Emoji (~16px)
    // and unread badges are too small to qualify.
    const queue = [...item.children];
    while (queue.length) {
      const el = queue.shift();
      const r = el.getBoundingClientRect();
      if (r.width >= 28 && Math.abs(r.width - r.height) <= 4 && r.height <= rect.height) return r;
      queue.push(...el.children);
    }
    return null;
  }

  function textColumn(item) {
    const rect = item.getBoundingClientRect();
    if (!rect.width) return null; // not laid out yet - retry next pass

    const avatar = avatarBox(item, rect);
    if (!avatar) return null;     // can't place it safely - leave the row covered

    // Clear of the avatar on whichever side it sits, so this works for
    // right-to-left interfaces without having to predict the layout.
    const clear = (r) => r.right <= avatar.left + 1 || r.left >= avatar.right - 1;

    const find = (node) => {
      for (const child of node.children) {
        const r = child.getBoundingClientRect();
        if (!r.width) continue;
        if (clear(r) && child.textContent.trim()) return child;
        const deeper = find(child);
        if (deeper) return deeper;
      }
      return null;
    };
    return find(item);
  }

  // WhatsApp re-renders rows in place (a new message, a reaction, a status
  // change), which throws away the element we tagged. So the test for "is
  // this row still covered?" is whether a live blur target is present -
  // never a marker we set once.
  const covered = (el) => el.classList.contains('wab-blur') || el.querySelector('.wab-blur') !== null;

  function tagChatList() {
    const pane = document.getElementById('pane-side');
    if (!pane) return;
    // Some WhatsApp builds mark chat rows as listitem, others as row.
    const kind = pane.querySelector('[role="listitem"]') ? 'listitem' : 'row';

    for (const item of pane.querySelectorAll(`[role="${kind}"]`)) {
      if (covered(item)) continue;
      const target = settings.blurAvatars ? item : textColumn(item);
      if (!target) continue; // not laid out yet; the fail-safe cover holds
      item.classList.add('wab-row');
      target.classList.add('wab-blur');
    }
  }

  function tagConversation() {
    const main = document.getElementById('main');
    if (!main) return;

    const header = main.querySelector('header');
    if (header && !covered(header)) {
      const name = header.querySelector('span[title]') || textColumn(header);
      const target = settings.blurAvatars ? header : name;
      if (target) {
        header.classList.add('wab-row');
        target.classList.add('wab-blur');
      }
    }

    // Each message (text, media, sender name inside groups) is one row.
    for (const row of main.querySelectorAll('[role="row"]')) {
      if (covered(row)) continue;
      row.classList.add('wab-row', 'wab-blur');
    }
  }

  function untagAll() {
    for (const el of document.querySelectorAll('.wab-blur, .wab-row, .wab-reveal')) {
      el.classList.remove('wab-blur', 'wab-row', 'wab-reveal');
    }
  }

  function scan() {
    if (!settings.enabled) return;
    if (settings.blurChatList) tagChatList();
    if (settings.blurConversation) tagConversation();
  }

  /* ---------- settings ------------------------------------------------ */

  function applySettings() {
    root.classList.toggle('wab-on', settings.enabled);
    root.classList.toggle('wab-list', settings.blurChatList);
    root.classList.toggle('wab-chat', settings.blurConversation);
    root.classList.toggle('wab-click', settings.revealMode === 'click');
    root.style.setProperty('--wab-radius', settings.radius + 'px');
    scan();
  }

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    settings = { ...DEFAULTS, ...stored };
    applySettings();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const key of Object.keys(changes)) settings[key] = changes[key].newValue;
    untagAll();       // re-tag from scratch: targets depend on the settings
    applySettings();
  });

  /* ---------- keeping up with a virtualised, re-rendering DOM ---------- */

  let queued = false;
  const rescan = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scan(); });
  };

  new MutationObserver(rescan).observe(root, { childList: true, subtree: true });
  document.addEventListener('scroll', rescan, true);
  setInterval(scan, 2000); // backstop for any re-render the observer misses

  /* ---------- click-to-reveal mode ------------------------------------ */

  document.addEventListener('click', (event) => {
    if (!settings.enabled || settings.revealMode !== 'click') return;
    const hit = event.target.closest?.('.wab-row, .wab-blur');
    if (!hit) return;
    const blurred = hit.classList.contains('wab-blur') ? hit : hit.querySelector('.wab-blur');
    if (!blurred || blurred.classList.contains('wab-reveal')) return; // 2nd click acts normally
    blurred.classList.add('wab-reveal');
    event.preventDefault();
    event.stopPropagation();
  }, true);
})();
