# Third-Party Attributions

Theme Designer Pro's own code and default themes are licensed as described in [LICENSE](LICENSE) (CC-BY-SA 4.0). The `.theme.json` sample files listed below reproduce color values from other open-source color-scheme projects, each under its own MIT license reproduced verbatim below. These are separate from — and not affected by — the license covering the rest of this repository.

Each palette is reproduced **faithfully**: the official hex values are used as-is, not adjusted to force a clean result from Theme Designer Pro's own contrast checker (same policy already applied to this repo's own Solarized Dark/Solarized Light samples — see `CLAUDE.md`). Where a source palette doesn't define enough distinct colors to cover every one of Theme Designer Pro's 40 UI roles (none of these four ship a full application-UI kit — they're color schemes, not full design systems), a role without an official equivalent (row/panel depth levels, hover-state shades, modal-overlay darkness) was filled in using another already-official color from the same palette, or a small computed lightness adjustment of one — never an invented off-palette color, and never used to fix a contrast failure.

---

## Nord

- **Source**: https://www.nordtheme.com/
- **Palette data**: https://github.com/nordtheme/nord
- **License**: MIT
- **Included as**: `Nord.theme.json`
- **Contrast check** (Theme Designer Pro's own checker, informational only): 1 real warning — `--text-danger` (Nord's only defined red, nord11) against `--row-bg` reads at 2.46:1. Nord doesn't define a distinct "row background" separate from its two darkest neutrals, and neither works better against its one red; not corrected, per the faithful-reproduction policy above. 4 additional warnings are Theme Designer Pro's own accepted/by-design divider-contrast category (see `README.md`'s "Understanding Contrast Warnings"), not specific to Nord.

```
MIT License (MIT)

Copyright (c) 2016-present Sven Greb <development@svengreb.de> (https://www.svengreb.de)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Dracula

- **Source**: https://draculatheme.com/
- **Palette data**: https://github.com/dracula/dracula-theme
- **License**: MIT
- **Included as**: `Dracula.theme.json`
- **Contrast check**: 0 real warnings — every text/status/button pairing clears WCAG AA. 4 accepted/by-design divider warnings (see above), not specific to Dracula.
- Dracula also has an official light counterpart, "Alucard" (same repo), not included this round — easy to add later if wanted.

```
The MIT License (MIT)

Copyright (c) 2023 Dracula Theme

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Catppuccin

- **Source**: https://catppuccin.com/
- **Palette data**: https://github.com/catppuccin/catppuccin
- **License**: MIT
- **Included as**: `Catppuccin Mocha.theme.json` (dark flavor), `Catppuccin Latte.theme.json` (light flavor)
- **Contrast check — Mocha**: 0 real warnings. 4 accepted/by-design divider warnings, not specific to Catppuccin.
- **Contrast check — Latte**: 3 real warnings — `--status-success-text`, `--status-info-text`, and `--banner-warning-text` (green/sky/yellow accents) fall short of 4.5:1 against every light neutral in Latte's own background scale (checked: base, mantle, crust, surface0 all tested, best case 2.96:1). This is a genuine, inherent characteristic of Catppuccin's pastel accent palette against its lightest flavor, not a mapping artifact — not corrected, per the faithful-reproduction policy above.

```
MIT License

Copyright (c) 2021 Catppuccin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## GitHub Primer

- **Source**: https://primer.style/
- **Palette data**: https://github.com/primer/primitives
- **License**: MIT
- **Included as**: `GitHub Primer Light.theme.json`, `GitHub Primer Dark.theme.json`
- **Contrast check — both**: 0 real warnings. 4 accepted/by-design divider warnings each, not specific to Primer. Unsurprising — Primer is GitHub's own design system and is professionally WCAG-audited by GitHub's accessibility team as part of its normal development process.
- Note: Primer's primary-action button color is *green* (`#1f883d` light / `#238636` dark), not blue — that's correct, not a mapping mistake. GitHub's actual primary buttons (Merge, Create, Confirm) are green; blue is reserved for links/secondary accents.

```
The MIT License (MIT)

Copyright (c) 2018 GitHub Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
