// Preview shim for FCEditor. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
//
// FCEditor's real script.js talks to Fusion through the `adsk` bridge and builds some of the UI at
// runtime, so the synced copy of its HTML has no script of its own. This shim stands in for just the
// parts that matter visually: tab switching, sample list items, the hidden "state" elements
// (notifications, banner, dialog) and a handful of sample values. It does not need to match
// script.js's logic, only produce the same *markup* so the real style.css has something to style.
//
// Contract with Theme Designer Pro: define window.__previewStates = { 'Button label': fn }. The
// designer shows one button per entry beneath the preview; clicking it calls fn().
// Keep this file in step with FCEditor_Index.html when ids/classes change (the sync tool's --check
// tells you when the source HTML or CSS changed).

(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function fillSelect(el, labels, selectedIndex) {
    if (!el) return;
    el.innerHTML = labels.map((l, i) => `<option${i === (selectedIndex || 0) ? ' selected' : ''}>${l}</option>`).join('');
  }

  // --- Tabs (same behavior as script.js switchTab) ---
  function switchTab(tabId) {
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    $$('.tab-button').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById('tab-' + tabId);
    const button = $(`.tab-button[data-tab="${tabId}"]`);
    if (panel) panel.classList.add('active');
    if (button) button.classList.add('active');
  }
  $$('.tab-button').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));

  // --- Per-design-type controls: preview the Fence Caddy view (shows the most controls) ---
  $$('[data-types]').forEach(el => el.classList.toggle('type-hidden', !el.dataset.types.split(' ').includes('FenceCaddy')));
  const customFields = document.getElementById('custom-fields');
  if (customFields) customFields.classList.remove('hidden');

  // --- Sample content ---
  const versionTag = document.getElementById('versionTag');
  if (versionTag) versionTag.textContent = 'preview';
  const footer = document.getElementById('footerVersion');
  if (footer) footer.textContent = 'preview';

  fillSelect(document.getElementById('main.punId'), ['[No Pun]', 'Custom', 'Fence-tastic', 'Wood You Be Mine', 'Nailed It'], 2);
  fillSelect(document.getElementById('main.keychainStyle'), ['Round', 'Rectangle']);
  fillSelect(document.getElementById('main.color'), ['Blue', 'Red', 'Green', 'Black']);
  fillSelect(document.getElementById('punpick'), ['(new pun)', 'Fence-tastic', 'Wood You Be Mine', 'Nailed It'], 1);

  const values = {
    'main.orderNum': '12345', 'main.qty': '2', 'main.name': 'ED',
    'main.customTop': 'FENCE', 'main.customBottom': 'CADDY', 'main.tweakFont': '4', 'main.tweakRow': '5',
    'pun.name': 'Fence-tastic', 'pun.text1': 'FENCE-TASTIC', 'pun.text2': '', 'pun.fontSize': '4', 'pun.rowSingle': '5',
    'pun.rowTop': '5', 'pun.rowBottom': '5',
    'config.stlFolderMacOS': '~/Desktop/FC Exports', 'config.stlFolderWindows': 'C:\\Users\\you\\Desktop\\FC Exports',
    'config.textDepth': '1', 'config.keychainMargin': '3',
    'config.paletteResetLeft': '100', 'config.paletteResetTop': '100', 'config.paletteResetWidth': '420', 'config.paletteResetHeight': '700',
    'theme.fontSize': '12'
  };
  Object.keys(values).forEach(id => { const el = document.getElementById(id); if (el) el.value = values[id]; });
  ['main.export3mf', 'main.exportStl'].forEach(id => { const el = document.getElementById(id); if (el) el.checked = true; });
  const hint = document.getElementById('export-folder-hint');
  if (hint) hint.textContent = 'Exports go to: ~/Desktop/FC Exports';
  const del = document.getElementById('pun-delete');
  if (del) del.disabled = false;

  // The Color Manager blocks are built at runtime by script.js (buildColorMgr); same markup here.
  const colorBlocks = document.getElementById('color-blocks');
  if (colorBlocks && !colorBlocks.children.length) {
    [['FenceCaddy', 'Fence Caddy colors'], ['PickleCam', 'PickleCam colors'], ['Keychain', 'Keychain name colors']].forEach(([type, title]) => {
      colorBlocks.insertAdjacentHTML('beforeend', `
        <details class="section" data-color-type="${type}">
          <summary>${title}</summary>
          <div class="actions secondary"><button type="button" class="cm-refresh">Refresh design colors</button></div>
          <label>Color <select class="cm-pick"><option>Blue</option><option>Red</option></select></label>
          <label>Pick from this design (fc colors) <select class="cm-design"><option>(choose&hellip;)</option></select></label>
          <div class="actions secondary"><button type="button" class="cm-new">New</button><button type="button" class="cm-delete" disabled>Delete&hellip;</button></div>
          <div class="actions secondary"><button type="button" class="cm-adddesign">Add all missing design colors</button></div>
          <label>Label (shown in the list) <input type="text" class="cm-label" value="Blue" autocomplete="off"></label>
          <label>Appearance name <input type="text" class="cm-appearance" value="fcBlue" autocomplete="off"></label>
          <span class="field-hint">Must match an appearance name in the design or your Fusion libraries (e.g. fcBlue).</span>
          <div class="actions"><button type="button" class="cm-save">Save Color</button></div>
          <div class="actions secondary"><button type="button" class="cm-reset">Reset to Built-in Colors</button></div>
        </details>`);
    });
  }

  // --- States the designer can trigger (see the contract at the top of this file) ---
  function notify(type, message) {
    const targets = [document.getElementById('notification')];
    const active = $('.tab-panel.active');
    if (active) targets.push(document.getElementById(active.id.replace('tab-', '') + '-notification'));
    targets.forEach(el => {
      if (!el) return;
      el.textContent = message;
      el.className = 'notification ' + type;
    });
  }

  function showDialog() {
    document.getElementById('modal-title').textContent = 'Delete this pun?';
    document.getElementById('modal-body').innerHTML = '<p>"Fence-tastic" will be removed from the list.\nThis can\'t be undone.</p>';
    document.getElementById('modal-overlay').classList.remove('hidden');
  }
  ['modal-btn-cancel', 'modal-btn-confirm'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', () => document.getElementById('modal-overlay').classList.add('hidden'));
  });

  window.__previewStates = {
    'Success notification': () => notify('success', 'Model updated.'),
    'Error notification': () => notify('error', 'Could not find the parameter "text_depth".'),
    'Info notification': () => notify('info', 'Working\u2026'),
    'Legacy-model banner': () => {
      switchTab('main');
      const banner = document.getElementById('model-banner');
      document.getElementById('model-banner-text').textContent = 'This model uses legacy parameters.';
      banner.classList.remove('hidden');
    },
    'Field error': () => {
      switchTab('main');
      const err = $('.field-error[data-error-for="orderNum"]');
      if (err) err.textContent = 'Order # is required.';
    },
    'Dialog': showDialog,
    'Clear states': () => {
      $$('.notification').forEach(el => el.classList.add('hidden'));
      document.getElementById('model-banner').classList.add('hidden');
      $$('.field-error').forEach(el => { el.textContent = ''; });
      document.getElementById('modal-overlay').classList.add('hidden');
    }
  };
})();
