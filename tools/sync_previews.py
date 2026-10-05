#!/usr/bin/env python3
"""Sync add-in palette UIs into previews/ so Theme Designer Pro can show them.

Dev-only helper (not shipped to users, no dependencies beyond the Python standard library).

For each add-in in tools/previews.config.json it:
  1. copies the add-in's real stylesheet to previews/<id>/style.css, plus any files listed under
     "assets" in the config (e.g. a sample image the palette shows), to previews/<id>/<to>
  2. takes the add-in's real HTML, removes its <script> tags (they need Fusion's `adsk` bridge),
     and adds <script src="preview-shim.js"> in their place
  3. records the add-in's version, the sync date and a hash of the source files in previews/manifest.json

previews/<id>/preview-shim.js is hand-written, lives only in this repo, and is NEVER overwritten.
It fills in what the add-in's own script would have built at runtime (sample list items, tab
switching, notifications...). See previews/README.md for the contract.

Usage:
  python tools/sync_previews.py            sync every add-in
  python tools/sync_previews.py FCEditor   sync one add-in
  python tools/sync_previews.py --check    report which previews are out of date; changes nothing
"""
import hashlib
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "tools" / "previews.config.json"
OUT = ROOT / "previews"


def digest(*paths):
    h = hashlib.sha256()
    for p in paths:
        h.update(Path(p).read_bytes())
    return h.hexdigest()[:12]


def addin_version(manifest_path):
    try:
        return str(json.loads(manifest_path.read_text(encoding="utf-8")).get("version", ""))
    except (OSError, ValueError):
        return ""


def transform_html(html, css_name):
    # Drop every <script> (src or inline): they depend on Fusion's adsk bridge and would error here.
    html = re.sub(r"<script\b[^>]*>.*?</script>\s*", "", html, flags=re.S | re.I)
    # The stylesheet is copied next to the HTML; drop any ?v= cache-buster so the link stays simple.
    html = re.sub(r'(href="[^"?]+)\?[^"]*"', r'\1"', html)
    # The copy is always previews/<id>/style.css; point a link to the add-in's differently named sheet at it.
    html = re.sub(r'href="[^"]*' + re.escape(css_name) + r'"', 'href="style.css"', html)
    # Some palettes add their stylesheet from an inline script (a cache-buster); with the script gone, link it.
    if not re.search(r'<link\b[^>]*rel=["\']stylesheet', html, flags=re.I):
        html = re.sub(r"</head>", '  <link rel="stylesheet" href="style.css">\n</head>', html, count=1, flags=re.I)
    # previews/_common.js (generic helpers: inline-handler stubs, tabs, sections) loads before the add-in's shim.
    shim = '  <script src="../_common.js"></script>\n  <script src="preview-shim.js"></script>\n'
    if re.search(r"</body>", html, flags=re.I):
        html = re.sub(r"</body>", shim + "</body>", html, count=1, flags=re.I)
    else:
        html += shim
    return html


def load_manifest():
    path = OUT / "manifest.json"
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except ValueError:
            pass
    return {"addins": []}


def main(argv):
    check = "--check" in argv
    only = [a for a in argv if not a.startswith("--")]
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    manifest = load_manifest()
    by_id = {a["id"]: a for a in manifest["addins"]}
    stale = 0

    for cfg in config["addins"]:
        if only and cfg["id"] not in only:
            continue
        src = (ROOT / cfg["source"]).resolve()
        html_path, css_path = src / cfg["html"], src / cfg["css"]
        missing = [p for p in (html_path, css_path) if not p.exists()]
        if missing:
            print(f"[{cfg['id']}] SKIPPED, source not found: {', '.join(str(p) for p in missing)}")
            continue

        new_hash = digest(html_path, css_path)
        version = addin_version(src / cfg.get("manifest", ""))
        old = by_id.get(cfg["id"], {})

        if check:
            if old.get("sourceHash") == new_hash:
                print(f"[{cfg['id']}] up to date (v{old.get('version', '?')}, synced {old.get('synced', '?')})")
            else:
                stale += 1
                print(f"[{cfg['id']}] STALE: source changed since last sync (add-in now v{version or '?'})")
            continue

        dest = OUT / cfg["id"]
        dest.mkdir(parents=True, exist_ok=True)
        (dest / "style.css").write_bytes(css_path.read_bytes())
        for asset in cfg.get("assets", []):
            asset_src = src / asset["from"]
            if not asset_src.exists():
                print(f"[{cfg['id']}] WARNING: asset not found: {asset_src}")
                continue
            asset_dest = dest / asset["to"]
            asset_dest.parent.mkdir(parents=True, exist_ok=True)
            asset_dest.write_bytes(asset_src.read_bytes())
        (dest / "index.html").write_text(transform_html(html_path.read_text(encoding="utf-8"), css_path.name), encoding="utf-8")
        shim = dest / "preview-shim.js"
        if not shim.exists():
            print(f"[{cfg['id']}] NOTE: {shim.relative_to(ROOT)} does not exist yet; the preview will show the raw markup only.")

        by_id[cfg["id"]] = {
            "id": cfg["id"],
            "name": cfg.get("name", cfg["id"]),
            "path": f"previews/{cfg['id']}/index.html",
            "version": version,
            "synced": date.today().isoformat(),
            "sourceHash": new_hash,
        }
        print(f"[{cfg['id']}] synced (v{version or '?'})")

    if not check:
        ordered = [by_id[a["id"]] for a in config["addins"] if a["id"] in by_id]
        OUT.mkdir(exist_ok=True)
        (OUT / "manifest.json").write_text(json.dumps({"addins": ordered}, indent=2) + "\n", encoding="utf-8")
    return 1 if stale else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
