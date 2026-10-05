# Add-in previews

Real palette layouts from Ed's Fusion add-ins, shown in Theme Designer Pro's **Live Preview** (the dropdown in its header; `ThemeDesigner.html?preview=FCEditor` deep-links one). The page must be served over http(s), same as the Demo theme set.

## How it's put together

Per add-in, `previews/<id>/` holds:

| File | Source | Touched by the sync tool? |
|---|---|---|
| `index.html` | the add-in's real HTML, with every `<script>` removed and `preview-shim.js` added | regenerated |
| `style.css` | a straight copy of the add-in's real stylesheet | regenerated |
| `assets/...` | optional files listed under `"assets"` in the config (`{ "from", "to" }`, e.g. a sample thumbnail the palette displays) | regenerated |
| `preview-shim.js` | hand-written: fills in what the add-in's own script builds at runtime | **never** overwritten |

`previews/manifest.json` (generated) lists each add-in with its version, sync date and a hash of the source files. The designer shows "Snapshot of FCEditor v3.1.1, synced ..." under the preview.

The designer applies the active theme by injecting one `<style>` into the iframe that overrides the add-in's own `:root` variables. Click an element in the preview and the Variables panel filters to the tokens that style it, found by reading the add-in's real CSS (the declarations that win the cascade for that element), so there is no per-add-in click map to maintain.

`previews/_common.js` (hand-written, shared) loads before each add-in's shim. It stubs every function the real HTML calls from an inline handler, makes tabs and collapsible sections work, makes the add-in's own header theme picker inert (the designer's Active Theme drives everything), and gives shims small helpers (`window.__preview.fill/text/html`). A new add-in's shim therefore only needs its sample rows and states.

## Updating after you change an add-in

```
python tools/sync_previews.py            # every add-in in tools/previews.config.json
python tools/sync_previews.py FCEditor   # one add-in
python tools/sync_previews.py --check    # lists which previews are stale; changes nothing
```

Then open the add-in's preview and look: if you added a new id/class that the shim should populate, update `preview-shim.js`. A UI-only change (new section, new button, restyled CSS) needs no shim edit.

## Adding an add-in

1. Add an entry to `tools/previews.config.json` (`id`, `name`, `source` folder relative to this repo, `html`, `css` and `manifest` paths relative to it — add-ins keep these in different places, e.g. FCEditor's `resources/` vs Lucy's Shape Forge's `palette/` — and optional `assets`). The output is always flattened into `previews/<id>/`, so relative links like `style.css` keep working.
   If the real HTML has inline handlers (`onclick="switchTab('x')"`), the shim must define those functions on `window`; see `LucysShapeForge/preview-shim.js`.
2. Run the sync tool.
3. Write `previews/<id>/preview-shim.js`. It only has to produce the *markup* the add-in's script would have (sample list items, filled fields, tab switching), and may define `window.__previewStates = { 'Label': fn }` — each entry becomes a button under the preview (notifications, dialogs, error states...). Use `FCEditor/preview-shim.js` as the model.

The add-in's CSS must read its colors from the standard variables (see the Integration Guide). Anything it hardcodes can't be themed, and the preview will show exactly that.
