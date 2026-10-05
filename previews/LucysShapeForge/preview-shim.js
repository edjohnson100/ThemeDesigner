// Preview shim for Lucy's Shape Forge. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// (See previews/README.md and previews/FCEditor/preview-shim.js for the contract.)
//
// The palette's real HTML calls functions that live in main.js (inline onclick="switchTab(...)" etc.),
// so they're defined here. Everything else here recreates what main.js fills in at runtime.

(function () {
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // Globals the real HTML's inline handlers call.
  window.switchTab = function (name) {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
  };
  window.toggleSection = function (id) { $(id).classList.toggle('collapsed'); };
  ['requestImport', 'requestExport', 'removeSelectedTheme', 'resetThemeCache', 'updateActiveThemeProperty']
    .forEach(n => { window[n] = function () {}; }); // Theme Manager buttons: nothing to do in a preview

  function fill(id, labels, selected) {
    const el = $(id);
    if (el) el.innerHTML = labels.map((l, i) => `<option${i === (selected || 0) ? ' selected' : ''}>${l}</option>`).join('');
  }

  // --- Sample content ---
  const tag = $('versionTag'); if (tag) tag.textContent = 'preview';
  const foot = $('versionFooterTag'); if (foot) foot.textContent = 'preview';
  fill('category', ['Platonic Solids', 'Archimedean Solids']);
  fill('shape', ['Cube', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Icosahedron']);

  const thumb = $('shapeThumb');
  if (thumb) { thumb.src = 'assets/Cube_rnd.png'; thumb.style.display = ''; }
  const info = $('shapeInfo');
  if (info) info.textContent = '6 faces, 8 vertices — Six square faces, three meeting at every vertex.';

  // Output mode: show the controls that "Bodies (Pyramids)" reveals in the real palette.
  function setDisplay(ids, value) { ids.forEach(id => { const el = $(id); if (el) el.style.display = value; }); }
  const bodiesOnly = ['bodiesOptionsField', 'seamFilletRow', 'splitBodyRow', 'cutOffsetLabel', 'cutOffset', 'shellBodyRow', 'timelineGroupRow'];
  function showBodies(on) {
    $('outputMode').value = on ? 'bodies' : 'sketch';
    setDisplay(bodiesOnly, on ? '' : 'none');
    const rb = $('randomizeAppearancesBtn'); if (rb) rb.style.display = on ? '' : 'none';
  }
  $('outputMode')?.addEventListener('change', () => showBodies($('outputMode').value === 'bodies'));

  function infoBox(id, html) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = html;
    el.style.display = '';
  }

  // --- States the designer can trigger ---
  window.__previewStates = {
    'Bodies output': () => { window.switchTab('shapes'); showBodies(true); },
    'Sketch-only output': () => { window.switchTab('shapes'); showBodies(false); },
    'Info boxes': () => {
      window.switchTab('shapes');
      showBodies(true);
      infoBox('seamFilletPreview', 'Seam fillet radius: 1.5 mm<br>Tightness: 1.0<br><span class="info-warning">Warning: fillet is larger than the shortest edge.</span>');
      infoBox('cutOffsetPreview', 'Cut offset: 10 mm from the center.');
    },
    'Status message': () => { const s = $('status'); if (s) s.textContent = 'Shapes loaded.'; },
    'Theme tab': () => window.switchTab('theme'),
    'Clear states': () => {
      showBodies(false);
      ['seamFilletPreview', 'cutOffsetPreview', 'shellThicknessPreview', 'panelClearancePreview'].forEach(id => { const el = $(id); if (el) el.style.display = 'none'; });
      const s = $('status'); if (s) s.textContent = '';
    }
  };
})();
