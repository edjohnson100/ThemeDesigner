// Preview shim for Lucy's Surface Forge. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// Same palette family as FCEditor (notification bar, <details> sections, dialog); generic behavior
// (tabs, inert theme picker) is in previews/_common.js.
(function () {
  const P = window.__preview;
  P.text('versionTag', 'preview');
  P.text('footerVersion', 'preview');
  P.text('main-area-preview', 'Surface area: 1,134 cm²');
  P.text('main-config-active', 'Active config: Soccer ball');

  const values = { 'main.ballDiameter': '70', 'main.seamBow': '0.12', 'main.lobeAmplitude': '0.2', 'main.junctionWidth': '1.2', 'main.seamWidth': '0.8', 'main.seamDepth': '0.5', 'main.panelThickness': '2', 'main.wedgeClearance': '0.2', 'theme.fontSize': '12' };
  Object.keys(values).forEach(id => { const el = P.$(id); if (el) el.value = values[id]; });

  function notify(type, message) {
    ['notification', 'main-notification'].forEach(id => {
      const el = P.$(id);
      if (el) { el.textContent = message; el.className = 'notification ' + type; }
    });
  }

  window.__previewStates = {
    'Success notification': () => notify('success', 'Surface created.'),
    'Error notification': () => notify('error', 'Could not find the target body.'),
    'Info notification': () => notify('info', 'Working…'),
    'Dialog': () => {
      P.text('modal-title', 'Delete this config?');
      P.html('modal-body', '<p>"Soccer ball" will be removed.\nThis can\'t be undone.</p>');
      P.$('modal-overlay').classList.remove('hidden');
    },
    'Clear states': () => {
      Array.from(document.querySelectorAll('.notification')).forEach(el => el.classList.add('hidden'));
      P.$('modal-overlay').classList.add('hidden');
    },
    'Themes tab': () => window.__preview_showTabByName('themes')
  };
  ['modal-btn-cancel', 'modal-btn-confirm'].forEach(id => {
    const b = P.$(id); if (b) b.addEventListener('click', () => P.$('modal-overlay').classList.add('hidden'));
  });
})();
