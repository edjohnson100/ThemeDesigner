// Preview shim for LiveParameters. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// Generic behavior (tabs, collapsible sections, inert theme picker, handler stubs) is in previews/_common.js.
(function () {
  const P = window.__preview;
  P.text('versionTag', 'preview');
  P.text('footerVersion', 'preview');
  P.text('docName', 'Document: Sink Strainer');

  const rows = [['Width', '120 mm', 'Overall width', true], ['Height', '80 mm', '', true], ['WallThickness', '2.4 mm', 'Printable wall', false], ['Label', '"Lucy"', '', false]];
  P.html('paramList', rows.map(([n, e, c, fav]) =>
    `<div class="param-row"><div class="param-label" title="${n}"><span style="color:${fav ? '#ff9e3b' : '#555'}; margin-right:6px; cursor:pointer;">\u2605</span>${n}</div>` +
    `<div class="param-input"><input type="text" value='${e}'>` +
    `<button class="icon-action-btn" title="Edit Name & Comment">\u270E</button>` +
    `<button class="icon-action-btn del-btn" title="Delete Parameter">\u00D7</button></div></div>`).join(''));

  function status(type, message) {
    const box = P.$('statusMessage');
    if (!box) return;
    box.textContent = message;
    box.className = 'status-box ' + type;
    box.style.display = 'block';
  }

  window.__previewStates = {
    'Add Parameter open': () => { const s = P.$('sec-actions'); if (s) s.classList.remove('collapsed'); },
    'Success status': () => status('success', 'Parameter created.'),
    'Error status': () => status('error', 'Name already exists.'),
    'Info status': () => status('info', 'Rescanning model\u2026'),
    'Empty list': () => P.html('paramList', '<div class="empty-state">No User Parameters found.</div>'),
    'Themes tab': () => window.__preview_showTabByName('tab-themes')
  };
})();
