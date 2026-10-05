// Preview shim for OrnamentBuddy. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// Generic behavior (tabs, collapsible sections, inert theme picker, handler stubs) is in previews/_common.js.
(function () {
  const P = window.__preview;
  P.text('versionTag', 'preview');
  P.text('footerVersion', 'preview');
  P.val = (id, v) => { const el = P.$(id); if (el) el.value = v; };
  P.val('nameInput', 'Lucy');
  P.val('filenameInput', 'Lucy_Ornament');
  P.text('folderPath', 'C:\Users\you\Desktop\Ornaments');

  // The style radio rows script.js builds from the model's BG_ groups.
  P.html('bgList', ['BG_Snowflake', 'BG_Star', 'BG_Heart'].map((n, i) =>
    `<div class="radio-row${i === 0 ? ' selected' : ''}"><div class="radio-circle">${i === 0 ? '\u25CF' : ''}</div><span>${n}</span></div>`).join(''));

  window.__previewStates = {
    'Themes tab': () => window.__preview_showTabByName('tab-themes'),
    'Design tab': () => window.__preview_showTabByName('tab-design')
  };
})();
