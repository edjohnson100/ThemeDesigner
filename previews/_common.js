// Shared helpers for every add-in preview shim. HAND-WRITTEN: tools/sync_previews.py never overwrites
// this file; it only makes sure each previews/<id>/index.html loads it before that add-in's own shim.
//
// What it does, generically, for any synced palette:
//  1. Stubs every function the real HTML calls from an inline handler (onclick="requestImport()") as a
//     no-op, so the palette's real script not being here never throws.
//  2. Makes tabs work (`.tab-btn` / `.tab-button` buttons, `.tab-content` / `.tab-panel` panels) and
//     collapsible sections (`.section-header` toggling `.collapsed` on its `.section`), if the add-in's
//     own shim hasn't defined switchTab / toggleSection itself.
//  3. Makes the add-in's own header theme picker inert: the designer's Active Theme is what applies here.
//  4. Provides window.__preview helpers (fill a <select>, add rows) for the per-add-in shims.
(function () {
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // 1. No-op stubs for inline handlers (onclick="foo(...)", onchange="foo(...)" ...).
  const wanted = new Set();
  $$('*').forEach(el => {
    Array.from(el.attributes).forEach(a => {
      if (!/^on/i.test(a.name)) return;
      for (const m of a.value.matchAll(/(?:^|[;\s(!{])([A-Za-z_$][\w$]*)\s*\(/g)) wanted.add(m[1]);
    });
  });
  const builtIn = new Set(['if', 'for', 'while', 'switch', 'function', 'return', 'event', 'alert', 'confirm', 'prompt']);
  wanted.forEach(name => {
    if (builtIn.has(name) || typeof window[name] !== 'undefined') return;
    window[name] = function () {};
  });

  // 2a. Tabs. The target panel comes from data-tab, or from the first quoted argument of the onclick.
  const tabButtons = $$('.tab-btn, .tab-button');
  function panelFor(btn) {
    let id = btn.dataset.tab || '';
    if (!id) { const m = /\(\s*['"]([^'"]+)['"]/.exec(btn.getAttribute('onclick') || ''); if (m) id = m[1]; }
    return document.getElementById(id) || document.getElementById('tab-' + id);
  }
  function showTab(btn) {
    const panel = panelFor(btn);
    if (!panel) return;
    $$('.tab-content, .tab-panel').forEach(p => p.classList.remove('active'));
    tabButtons.forEach(b => b.classList.remove('active'));
    panel.classList.add('active');
    btn.classList.add('active');
  }
  tabButtons.forEach(b => b.addEventListener('click', () => showTab(b)));
  window.__preview_showTabByName = function (name) {
    const btn = tabButtons.find(b => (b.dataset.tab || '') === name || (b.getAttribute('onclick') || '').includes(`'${name}'`) || (b.getAttribute('onclick') || '').includes(`'tab-${name}'`));
    if (btn) showTab(btn);
  };

  // 2b. Collapsible sections: header click toggles .collapsed on the section (unless the add-in's own
  //     handler is a real function, i.e. a shim already defined toggleSection).
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.section-header');
    if (!header || e.target.closest('.header-controls, button, input, select, label')) return;
    const section = header.closest('.section');
    if (section && !section.matches('details')) section.classList.toggle('collapsed');
  });

  // 3. The add-in's own theme picker doesn't drive anything here.
  $$('.header select, #themeSelect, #themeSelector, #themeSelect').forEach(sel => {
    sel.style.pointerEvents = 'none';
    sel.tabIndex = -1;
    sel.title = 'Inactive in the preview: use Active Theme in Theme Designer Pro.';
  });

  // 4. Helpers for the per-add-in shims.
  window.__preview = {
    $: (id) => document.getElementById(id),
    $$: $$,
    fill(id, labels, selected) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = labels.map((l, i) => `<option${i === (selected || 0) ? ' selected' : ''}>${l}</option>`).join('');
    },
    text(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; },
    html(id, value) { const el = document.getElementById(id); if (el) el.innerHTML = value; },
    show(id, on) { const el = document.getElementById(id); if (el) el.style.display = on === false ? 'none' : ''; }
  };
})();
