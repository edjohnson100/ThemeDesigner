// Preview shim for LiveUtilities. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// Generic behavior (tabs, collapsible sections, inert theme picker, handler stubs) is in previews/_common.js;
// this recreates the rows liveutils_script.js builds at runtime (createParamRow, renderConfigs, ...).
(function () {
  const P = window.__preview;
  P.text('versionTag', 'preview');
  P.text('footerVersion', 'preview');

  const paramRow = (name, expr, fav, userParam) =>
    `<div class="data-row"><div class="row-label" title="${name}" style="flex: 0 1 40%; margin-right: 5px;">` +
    `<span style="color:${fav ? '#ff9e3b' : '#555'}; cursor:pointer; margin-right:4px;">\u2605</span>${name}</div>` +
    `<div class="row-controls" style="flex: 1 1 70%;"><input type="text" value="${expr}" style="flex-grow: 1; width: 50px; min-width: 60px;">` +
    `<button class="action-btn" title="Edit">\u270E</button>` +
    (userParam ? `<button class="action-btn del-btn" title="Delete">\u00D7</button>`
               : `<button class="action-btn" disabled style="opacity: 0.3; cursor: not-allowed;">\u00D7</button>`) +
    `</div></div>`;
  P.html('userParamList', paramRow('Width', '120 mm', true, true) + paramRow('Height', '80 mm', true, true) + paramRow('WallThickness', '2.4 mm', false, true));
  P.html('modelParamList', paramRow('d12', '45 deg', false, false) + paramRow('d27', 'Width / 2', false, false));

  const names = ['Large size', 'Small size', 'Default'];
  P.html('configList', names.map((n, i) =>
    `<div class="data-row"><input type="checkbox" class="config-export-cb" style="flex-shrink:0;">` +
    `<button class="btn-secondary snapshot-btn" style="flex-grow:1; text-align:left; margin-right:5px;` +
    (i === 0 ? ' border-color: #28a745; color: #28a745;' : '') + `">${n}</button>` +
    `<div class="row-controls"><button class="action-btn" title="Update">\uD83D\uDCBE</button><button class="action-btn del-btn" title="Delete">\u00D7</button></div></div>`).join(''));

  const switchRow = (label, on, extra) =>
    `<div class="data-row"><span class="row-label"${extra ? ' style="flex:1;"' : ''}>${label}${extra ? `<span style="font-size:calc(var(--font-size-base) - 3px); color:var(--text-sub); margin-left:5px;">${extra}</span>` : ''}</span>` +
    `<label class="theme-switch" style="transform: scale(0.8); margin-right: 5px;"><input type="checkbox"${on ? ' checked' : ''}><span class="theme-slider"></span></label></div>`;
  P.html('featureList', switchRow('CFG_Handle', true) + switchRow('CFG_Lid', false) + switchRow('CFG_Feet', true));
  P.html('visibilityList', switchRow('CFG_Body', true, 'Body') + switchRow('CFG_Sketch', false, 'Sketch') + switchRow('CFG_Parts', true, 'Component'));

  P.html('scriptLauncherList',
    `<button class="btn-success" style="padding: 9px 12px; margin-bottom: 6px; font-size: calc(var(--font-size-base) - 1px); text-align: left; display: flex; align-items: center; justify-content: flex-start; gap: 8px;"><span style="opacity: 0.8; font-size: calc(var(--font-size-base) - 3px);">\u25B6</span> Batch Export</button>`);
  P.html('scriptManagerList',
    `<div class="data-row" style="margin-bottom: 4px;"><span class="row-label" title="C:\Scripts\BatchExport">Batch Export</span><div class="row-controls"><button class="action-btn del-btn" title="Unlink">\u00D7</button></div></div>`);

  function status(type, message) {
    const box = P.$('statusMessage');
    if (!box) return;
    box.textContent = message;
    box.className = 'status-box ' + type;
    box.style.display = 'block';
  }

  window.__previewStates = {
    'Success status': () => status('success', 'Snapshot saved.'),
    'Error status': () => status('error', 'Parameter name already exists.'),
    'Info status': () => status('info', 'Rescanning model\u2026'),
    'Config tab': () => window.__preview_showTabByName('tab-config'),
    'Scripts tab': () => window.__preview_showTabByName('tab-scripts'),
    'Themes tab': () => window.__preview_showTabByName('tab-themes')
  };
})();
