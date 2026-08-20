/* Keyboard shortcut (Alt+Shift+B): flip the master switch. */
chrome.commands.onCommand.addListener((command) => {
  if (command !== 'toggle-blur') return;
  chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
    chrome.storage.sync.set({ enabled: !enabled });
  });
});
