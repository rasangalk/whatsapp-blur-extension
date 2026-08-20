const DEFAULTS = {
  enabled: true,
  radius: 6,
  blurChatList: true,
  blurConversation: true,
  blurAvatars: false,
  revealMode: 'hover'
};

const $ = (id) => document.getElementById(id);
const checkboxes = ['enabled', 'blurChatList', 'blurConversation', 'blurAvatars'];

function render(settings) {
  for (const key of checkboxes) $(key).checked = settings[key];
  $('radius').value = settings.radius;
  $('radiusOut').textContent = settings.radius + 'px';

  for (const button of $('revealMode').children) {
    button.setAttribute('aria-pressed', String(button.dataset.value === settings.revealMode));
  }

  document.body.classList.toggle('off', !settings.enabled);
  document.body.classList.toggle('blurring', settings.enabled);
  document.body.classList.toggle('avatars', settings.blurAvatars);
  document.body.classList.toggle('clickmode', settings.revealMode === 'click');
  $('preview').classList.remove('revealed');
  document.body.style.setProperty('--preview-blur', settings.radius + 'px');
  $('preview').querySelector('.hint').textContent =
    settings.revealMode === 'click' ? 'Click the row to preview' : 'Hover the row to preview';
}

function save(patch) {
  chrome.storage.sync.set(patch);
  chrome.storage.sync.get(DEFAULTS, render);
}

chrome.storage.sync.get(DEFAULTS, render);

for (const key of checkboxes) {
  $(key).addEventListener('change', (e) => save({ [key]: e.target.checked }));
}

$('radius').addEventListener('input', (e) => save({ radius: Number(e.target.value) }));

$('revealMode').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (button) save({ revealMode: button.dataset.value });
});

$('reset').addEventListener('click', () => save(DEFAULTS));

// The preview honours the chosen reveal mode.
$('preview').addEventListener('click', (e) => {
  if (e.target.closest('.row')) e.currentTarget.classList.toggle('revealed');
});
