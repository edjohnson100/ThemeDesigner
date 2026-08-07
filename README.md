# 🎨 Theme Designer Pro

**Version:** 1.5.0

**Author:** Ed Johnson (Making With An EdJ)

**A web-based visual theme editor and companion tool for Autodesk Fusion Add-ins.**

**[👉 CLICK HERE TO USE THE LIVE THEME DESIGNER](https://edjohnson100.github.io/ThemeDesigner/)**

---
## ✨ What's New in v1.5.0

* **Four more importable palettes:** [Nord](https://www.nordtheme.com/), [Dracula](https://draculatheme.com/), [Catppuccin](https://catppuccin.com/) (Mocha + Latte), and [GitHub Primer](https://primer.style/) (Light + Dark) are now available as `.theme.json` samples — grab one from the repo and load it with **📂 Load .json**. All four are MIT-licensed and reproduced faithfully from their official palettes (not adjusted to force a clean checker result — same policy as this repo's own Solarized samples). See **[ATTRIBUTIONS.md](ATTRIBUTIONS.md)** for full license text and honest contrast-warning notes per palette. These aren't in the default dropdown — same reasoning as Solarized, they're one click away without growing the curated bundled list.
* **License changed to CC BY-SA 4.0:** Dropped the NonCommercial clause (was CC-BY-NC-SA) — commercial use of Theme Designer Pro itself, or of its exported output, is now explicitly permitted. Attribution and ShareAlike still apply. See **[LICENSE](LICENSE)**.

## What's New in v1.4.0

* **Suggest-a-fix:** A 🔧 link now appears next to any picker row with a real contrast failure. Click it to open a confirmation dialog showing the current color next to a computed replacement — same hue, darkened or lightened along that hue until it clears WCAG AA against every background it's actually checked against — and apply it with one click. It never changes anything without that explicit confirmation, and the dialog is the app's own themed modal, not a browser popup.
* **Warning counts now separate "real" from "accepted" issues:** The summary count and the theme dropdown's `(N ⚠)` badge only count real failures (body text, tabs, status colors, etc.) — the by-design divider/border warnings introduced in v1.3.0 no longer inflate that number. Every compliant theme now shows as clean in the dropdown, matching what "compliant" actually means. Per-row badges still show the true status for every pair, including accepted ones (in a muted color, not red) — nothing is hidden, just not double-counted as urgent. See "Understanding Contrast Warnings" below for the full explanation.

## What's New in v1.3.0

* **Bundled themes are now contrast-checked, not just contrast-tagged:** Ran the full checker (not just buttons) against every theme. Real fixes: Gruvbox Light's inactive-tab text, Warm Sepia's active-tab text, and every theme's `--input-placeholder` — all failed outright and are now fixed (same hue, darkened/lightened until they clear AA). Everything else that still shows a warning is a deliberately subtle divider or input border (see below).
* **Solarized Dark and Solarized Light moved out of the default set:** Both have deep, structural contrast failures (body text, tabs, status colors) that come from Solarized's own reduced-contrast design — correcting them would mean they stop looking like Solarized. Rather than force a fix or quietly drop them, they're still fully available two ways: load the demo theme set (see next point), or grab **[Solarized Dark.theme.json](Solarized%20Dark.theme.json)** / **[Solarized Light.theme.json](Solarized%20Light.theme.json)** directly and import them with **📂 Load .json** — same original colors, just not shipped as if they were contrast-checked.
* **New "Theme Set" toggle:** Two buttons — **⚠️ Load Demo (has warnings)** and **✅ Load Compliant** — let you swap the entire in-memory theme set between the shipped, contrast-checked themes and a frozen snapshot that keeps its real issues (including Solarized) on purpose, so you can see the checker flag genuine problems instead of a clean set. Requires the app to be served over http(s) (see "Running the App" below) — it won't work opening `ThemeDesigner.html` directly as a local file.
* **A note on "passing":** the compliant set isn't warning-free — every theme still flags a handful of low-contrast dividers and input borders. Those are accepted as by-design (a border also distinguished by background color isn't the sole way to identify a control under WCAG) rather than chased to a green checkmark by darkening every subtle line in the app. Placeholder text got fixed rather than accepted, since — unlike a decorative divider — it's content people actually read.

## What's New in v1.2.0

* **Button text is themeable:** Added `--btn-primary-text` / `--btn-success-text` so a button's foreground color is no longer hardcoded to white — several bundled themes (Ocean, Hot Pink, and others) had bright accent buttons that failed WCAG contrast with white text; they now use dark text where needed.
* **Visible keyboard focus:** Buttons, tabs, inputs, selects, checkboxes/radios, and range sliders now get a `:focus-visible` outline driven by a new `--focus-ring` variable — there was previously no visible focus indicator anywhere in the app.
* **New semantic tokens:** `--text-danger` (replaces a hardcoded delete-hover red) and `--overlay-bg` (replaces a hardcoded modal-overlay darkness), bringing the total to 40 themeable variables.
* **Built-in contrast checker:** Each color picker now shows a pass/fail badge (✓/⚠/✗/—) against WCAG AA thresholds for the pairs that matter (text on background, button text on button, status/banner text, and a few UI-boundary checks), plus a running warning count for the active theme and a warning count next to any theme in the dropdown that has one. This checks a fixed set of known pairs — it's not a full accessibility audit.
* **Bundled themes corrected:** Fixed real contrast failures found by the new checker, most notably Ocean's and Hot Pink's buttons, which failed outright with white text.

## What's New in v1.1.0

* **Version display:** The app now shows its version number in the header, so you can tell at a glance which build you're running.
* **Banner/alert variable:** Added `--banner-warning-bg` / `--banner-warning-text` / `--banner-warning-border` for an optional inline warning strip (e.g. an "unsaved edits" banner), bringing the total to 35 themeable variables.
* **Fixed a dead variable:** `--header-hover` previously had no effect anywhere in the app — it's now wired to a hover state on panel headers.
* **Fixed Live Preview highlighting:** Clicking the modal's secondary-text caption now correctly highlights the `--text-sub` picker instead of being swallowed by the parent modal's variables.
* **Focused variable list:** Clicking a Live Preview element now hides every picker row except the ones that actually control it. A **✕ Show All** link appears in the Variables panel header to clear the filter.
* **Longer highlight glow:** The pulse animation on a matched picker row now lasts 4.5s (up from 1.5s), giving you more time to spot it.

## What's New in v1.0.1

* **Theme accent border:** Exported `style.css` files now include a subtle primary-color border on the palette body. If you import an older `style.css` that is missing the border, Theme Designer will automatically add it when you export again — no manual editing required.

---

## Introduction

Theme Designer Pro is a standalone, purely client-side web application designed to generate, manage, and edit custom CSS/JSON themes. 

While it can be adapted for any web project, it was specifically built as a companion tool for **[LiveUtilities](https://github.com/edjohnson100/LiveUtilities)** (and other Fusion add-ins) to allow users to customize their HTML palette UIs without having to write a single line of CSS.

## Features

* **Live Preview Environment:** Tweak a color variable and instantly see how it affects inputs, dropdowns, tabs, sliders, and modal dialogs.
* **Smart Highlighting:** Click any element in the live preview, and the designer will automatically highlight the corresponding CSS variables you need to change.
* **Built-in WCAG Contrast Checker:** Every color picker shows a live pass/fail badge, with a running warning count per theme — catches unreadable text before you export it.
* **Full CSS Export:** Generate a complete `style.css` file combining base layout rules with all of your custom themes.
* **Modular JSON Export:** Export a single theme as a lightweight `.theme.json` file that can be instantly imported into the LiveUtilities Theme Manager.
* **Bonus Sample Palettes:** Beyond the 7 bundled themes, popular MIT-licensed color standards (Nord, Dracula, Catppuccin, GitHub Primer) ship as ready-to-import `.theme.json` files — see [ATTRIBUTIONS.md](ATTRIBUTIONS.md).
* **Zero Dependencies:** Pure HTML, CSS, and Vanilla JavaScript. No servers, no build steps, no databases.

---

## Understanding Contrast Warnings

Every color picker shows a live WCAG badge — `✓` pass, `⚠` passes for large text/UI components only, `✗` fail, `—` unevaluated (an unsupported color format, or a color with partial transparency the checker won't guess a background for). The header also shows a running count of real, unaddressed warnings for the active theme, and any theme with one shows a `(N ⚠)` badge in the Active Theme dropdown.

A handful of pairs are flagged **known, accepted by design** and don't count toward that number:

* `--input-border`, `--border-color`, and `--banner-warning-border` are deliberately subtle dividers and input outlines. Each is also distinguished by a background-color difference elsewhere (an input's background differs from the surface around it, for example), which is the situation WCAG's non-text contrast rule (1.4.11) doesn't strictly require 3:1 for.
* They still show their true status on their own picker row — a muted gray badge instead of red — so nothing is hidden. They're just not counted as "needs attention," since darkening every divider across every bundled theme to force a green checkmark everywhere was a deliberate call *not* to make.
* `--input-placeholder` is **not** on this list — placeholder text is real content people read, so every bundled theme's placeholder is held to the normal 4.5:1 bar like any other text.

When a real (non-accepted) failure shows up, a 🔧 link appears next to its badge — click it to see a computed same-hue replacement and apply it with one confirmation.

**This checker validates a fixed list of known foreground/background pairs against WCAG 2.x contrast ratios — it is not a full accessibility audit.** A theme with zero (counted) warnings has no *known* failure in those specific pairs; it says nothing about keyboard navigation, screen-reader semantics, or anything outside color contrast.

## Using the Theme Standard in Your Own Project

Theme Designer Pro's theme system (CSS custom properties + a `data-theme` attribute) isn't tied to LiveUtilities or Fusion — it can be dropped into any HTML/CSS/JS project. See **[Theme_Designer_Pro_Integration_Guide.md](Theme_Designer_Pro_Integration_Guide.md)** for a step-by-step walkthrough (human- and AI-assistant-friendly) covering the variable naming standard, wiring up theme switching, persisting user choices, and importing/exporting `.theme.json` files.

## How to Use with LiveUtilities

You don't need to download this repository to use the tool! Simply visit the **Live Website**.

### 1. Creating a Custom Theme (.json)
1. Select a base theme from the dropdown (e.g., "Classic Dark").
2. Click the **➕** button and give your new theme a name (e.g., "Hot Pink").
3. Use the OS-native color pickers to adjust the variables.
4. Click **💾 Save .json** to download your theme.
5. Open Fusion, launch the LiveUtilities palette, go to the **Themes** tab, and import your JSON file!

### 2. Creating a Global Override (style.css)
If you want to completely replace the built-in themes for your add-in:
1. Set up all the themes you want in the Theme Designer.
2. Click **📤 Export style.css**.
3. Drop the downloaded `style.css` file directly into the `resources` folder of your LiveUtilities installation. 

---

## License & Credits

* **Developer:** Ed Johnson (Making With An EdJ)
* **AI Assistance:** Developed with coding assistance from Google's Gemini 3.1 Pro model.
* **License:** Creative Commons Attribution-ShareAlike 4.0 International License.
* **Lucy (The Cavachon Puppy):**
  ***Chief Wellness Officer & Director of Mandatory Breaks***

---

*If you find this tool useful for your own Add-in development or parametric workflows, feel free to **[buy Lucy a dog treat on Ko-fi](https://ko-fi.com/makingwithanedj)**!

***

*Happy Making!*
*— EdJ*
