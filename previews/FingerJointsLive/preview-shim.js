// Preview shim for Finger Joints Live. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// The palette is mostly static markup; generic behavior (tabs, inert theme picker, handler stubs) is in
// previews/_common.js. Its real HTML adds style.css from an inline script, which the sync tool replaces
// with a plain <link>.
(function () {
  const P = window.__preview;
  P.text('versionTag', 'preview');
  const footer = P.$('footerVersion'); if (footer) footer.textContent = 'preview';
  P.fill('presetSelect', ['-- Presets --', '3/4" plywood box', 'Thin drawer joint'], 1);

  function status(id, type, message) {
    const box = P.$(id);
    if (!box) return;
    box.textContent = message;
    box.className = 'status-box' + (type ? ' ' + type : '');
    box.style.display = 'block';
  }

  window.__previewStates = {
    'Joints info': () => { window.__preview_showTabByName('tab-selections'); status('jointsStatus', 'info', 'Select two faces to preview the joint.'); },
    'Dogbone info': () => { window.__preview_showTabByName('tab-dogbone'); status('dogboneStatus', 'info', 'Select edges to add dogbones.'); },
    'Dogbone tab': () => window.__preview_showTabByName('tab-dogbone'),
    'Themes tab': () => window.__preview_showTabByName('tab-settings')
  };
})();
