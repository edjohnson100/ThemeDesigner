// Preview shim for LiveConfig. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// Generic behavior (tabs, collapsible sections, inert theme picker, inline-handler stubs) comes from
// previews/_common.js; this file only recreates the rows script.js builds at runtime.
(function () {
  const P = window.__preview;
  P.text('versionTag', 'preview');
  P.text('footerVersion', 'preview');
  P.text('docName', 'Document: Sink Strainer');

  P.html('configList', ['Default', 'Large size', 'Small size'].map((n, i) =>
    `<div class="config-row"><button class="config-btn${i === 0 ? ' active-config' : ''}">${n}</button>` +
    `<button class="action-btn update-btn">💾</button><button class="action-btn delete-btn">🗑️</button></div>`).join(''));

  const params = [['Width', '120 mm', true], ['Height', '80 mm', true], ['WallThickness', '2.4 mm', false]];
  P.html('paramList', params.map(([n, e, fav]) =>
    `<div class="param-row"><div class="param-label" title="${n}"><span class="fav-star" style="color:${fav ? '#ff9e3b' : '#555'}; margin-right:6px; cursor:pointer;">★</span>${n}</div>` +
    `<div class="param-input"><input type="text" value="${e}"></div></div>`).join(''));

  P.html('featureList', [['CFG_Handle', true], ['CFG_Lid', false], ['CFG_Feet', true]].map(([n, on]) =>
    `<div class="feature-row"><span>${n}</span><label class="switch"><input type="checkbox"${on ? ' checked' : ''}><span class="slider"></span></label></div>`).join(''));

  window.__previewStates = {
    'Themes tab': () => window.__preview_showTabByName('tab-themes'),
    'Configs tab': () => window.__preview_showTabByName('tab-configs'),
    'Empty lists': () => {
      P.html('configList', '<div class="empty-state">No configs saved.</div>');
      P.html('paramList', '<div class="empty-state">No User Parameters found.</div>');
    }
  };
})();
