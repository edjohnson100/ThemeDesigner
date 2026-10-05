// Preview shim for ChangelogSidecar. HAND-WRITTEN: tools/sync_previews.py never overwrites this file.
// The palette is almost entirely static markup; _common.js (tabs, sections, inert theme picker) does the rest.
(function () {
  const P = window.__preview;
  P.text('versionTag', 'preview');
  P.text('footerVersion', 'preview');
  const note = P.$('newEntryText'); if (note) note.value = 'Raised the lid by 2 mm and re-filleted the edge.';
  const ms = P.$('milestoneReason'); if (ms) ms.value = 'Final Draft';
  window.__previewStates = {
    'Themes tab': () => window.__preview_showTabByName('tab-themes'),
    'Changelog tab': () => window.__preview_showTabByName('tab-changelog')
  };
})();
