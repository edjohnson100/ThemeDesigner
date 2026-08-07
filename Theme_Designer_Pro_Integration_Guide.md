# Theme Designer Pro — Integration Guide

How to wire the Theme Designer Pro theme standard into **any** HTML/CSS/JS UI — Fusion add-in palette, Electron app, browser extension, static site, or plain webpage. This doc is written to be read by both humans and AI coding assistants (Claude, Copilot, Cursor, etc.) — if you're an AI assistant implementing this for a user, follow the steps below literally and adapt file/selector names to the host project's existing markup.

The theme system has **no dependencies**. It is CSS custom properties (variables) + one `data-theme` attribute + optional JSON files for saving/loading. It works in any project that renders HTML, regardless of framework (React, Vue, vanilla, Qt WebEngine, Fusion palettes, etc.) because it relies only on standard CSS variable cascading.

---

## 1. The Standard, in One Paragraph

Every themeable color/style value in your UI is written as `var(--some-name)` instead of a literal value. A `:root` block defines the default ("Light") theme's values for those variables. Additional themes are defined as `[data-theme="Theme Name"] { --some-name: value; ... }` blocks that override the root values. Switching themes at runtime is just: `document.body.setAttribute('data-theme', 'Theme Name')` (or `removeAttribute` to fall back to `:root`). That's the entire mechanism — no JS framework, no re-render, the browser's CSS cascade does all the work.

---

## 2. The Variable Set

These are the standard variables currently used by Theme Designer Pro. You don't have to use all of them — pick the subset that matches what your UI actually has (e.g., a UI with no tabs can skip the `--tab-*` vars, and a UI with no inline warning strip can skip `--banner-warning-*`). You *can* also add your own project-specific variables; the tool doesn't hardcode the list, it reads whatever's in your CSS.

```css
:root {
    /* Typography */
    --font-family: 'Segoe UI', Tahoma, sans-serif;
    --font-size-base: 13px;

    /* Page/body */
    --bg-body: #f5f5f5;
    --text-main: #333333;
    --text-sub: #666666;
    --border-color: #dddddd;

    /* Rows / list items / cards */
    --row-bg: #ffffff;
    --row-border: #cccccc;
    --row-hover: #e8e8e8;

    /* Form inputs */
    --input-bg: #ffffff;
    --input-border: #cccccc;
    --input-text: #333333;
    --input-placeholder: #aaaaaa;
    --toggle-bg: #cccccc;

    /* Tabs / headers */
    --header-hover: #e8e8e8;
    --tab-bg: #e0e0e0;
    --tab-active-bg: #ffffff;
    --tab-text: #666666;
    --tab-active-text: #0078d4;

    /* Buttons */
    --btn-primary: #0078d4;
    --btn-primary-hover: #106ebe;
    --btn-primary-text: #ffffff;
    --btn-success: #28a745;
    --btn-success-hover: #218838;
    --btn-success-text: #000000;
    --btn-secondary: #e0e0e0;
    --btn-secondary-hover: #d0d0d0;
    --btn-secondary-text: #333333;

    /* Status / alert boxes */
    --status-success-bg: #d4edda;
    --status-success-text: #155724;
    --status-error-bg: #f8d7da;
    --status-error-text: #721c24;
    --status-info-bg: #cce5ff;
    --status-info-text: #004085;

    /* Alert / edit banner (optional) */
    --banner-warning-bg: #fff8e1;
    --banner-warning-text: #8a6d00;
    --banner-warning-border: #e6c200;

    /* Accessibility */
    --focus-ring: #0078d4;
    --text-danger: #721c24;
    --overlay-bg: rgba(0,0,0,0.6);
}
```

`--btn-primary-text` / `--btn-success-text` exist because a button's foreground color is not safely assumable — a bright accent (e.g. a saturated cyan or pink `--btn-primary`) often needs dark text, not white, to clear WCAG AA. Don't hardcode `color: white` on a button rule; always go through the paired `-text` variable, and check both the base and hover background against it (see Section 5, Contrast Checking).

Naming convention: `--{category}-{role}` (e.g. `--btn-primary-hover`, `--status-error-text`). Stick to this pattern for any variables you add so Theme Designer Pro's generic parser and preview highlighter can still make sense of them.

---

## 3. Step-by-Step Integration

### Step 1 — Extract hardcoded colors into CSS variables
Go through your existing stylesheet and replace every literal color/font value with `var(--name)`, adding the variable to the table above (or a project-specific equivalent) if it doesn't already have a home. Do this for: backgrounds, text colors, borders, hover states, button colors, and any status/alert styling.

```css
/* Before */
button.primary { background: #0078d4; color: white; }

/* After — the foreground goes through a variable too, since a future theme's
   --btn-primary might be too light for white text to stay readable */
button.primary { background: var(--btn-primary); color: var(--btn-primary-text); }
```

### Step 2 — Create your theme stylesheet
Put a `:root { ... }` block with your default theme values at the top of a CSS file (this can be your existing stylesheet, or a dedicated `themes.css`). Add extra themes as sibling `[data-theme="Name"] { ... }` blocks, each overriding the same variable names:

```css
:root { /* Default Light */
    --bg-body: #f5f5f5;
    --text-main: #333333;
    /* ...all other vars... */
}

[data-theme="Dark"] {
    --bg-body: #1e1e1e;
    --text-main: #eeeeee;
    /* ...all other vars... */
}
```

CSS custom properties do reliably inherit from `:root` under normal cascade/scope rules — you technically only need to declare a variable in `[data-theme="X"]` if its value actually differs from `:root`. Theme Designer Pro's own themes still write out the full variable set in every block anyway, on purpose: it keeps each exported theme self-contained and portable (drop one `[data-theme]` block into another project and it works, without needing that project's `:root` too), easier to inspect at a glance, and immune to a later edit of `:root` accidentally changing an "unset" value in every other theme. If you're hand-authoring themes and don't need that portability, relying on inheritance for unchanged values is perfectly safe CSS.

### Step 3 — Apply the theme attribute
Set `data-theme` on `<html>` or `<body>` (pick one and be consistent — it must match the selector in your CSS). This is the only runtime JS needed to activate a theme:

```js
function applyTheme(themeName) {
    if (themeName && themeName !== 'Default Light') {
        document.body.setAttribute('data-theme', themeName);
    } else {
        document.body.removeAttribute('data-theme');
    }
}
```

Call this on load (reading a saved preference) and whenever the user picks a new theme from a dropdown/toggle.

### Step 4 — Persist the user's choice
Use whatever storage mechanism fits the host environment:

```js
// Browser / Electron / most web contexts
localStorage.setItem('theme', themeName);
const saved = localStorage.getItem('theme');

// Fusion add-in palette (no localStorage across palette reloads unless persisted host-side)
// send the theme name back to Python via adsk.fusionSendData / htmlArgs and store it
// in a Fusion Document Attribute or user preference, then re-apply it when the palette reloads.
```

### Step 5 (optional) — Support importing/exporting `.theme.json`
Theme Designer Pro exports individual themes as JSON with this shape:

```json
{
  "id": "Hot Pink",
  "vars": {
    "--bg-body": "#f5f5f5",
    "--btn-primary": "#e401dd",
    "...": "..."
  }
}
```

To let your app import a theme file at runtime without editing CSS at all, inject the vars into a `<style>` tag scoped to `[data-theme="..."]`, or apply them as inline custom properties on `document.body`:

```js
function loadThemeJSON(themeData) {
    const { id, vars } = themeData;
    let styleTag = document.getElementById('dynamic-theme-overrides');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-theme-overrides';
        document.head.appendChild(styleTag);
    }
    const decls = Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(' ');
    styleTag.textContent = `[data-theme="${id}"] { ${decls} }`;
    document.body.setAttribute('data-theme', id);
}

// fetch/upload the .theme.json, then:
loadThemeJSON(JSON.parse(fileContents));
```

This means end users can design a theme visually in Theme Designer Pro's live web tool, export a `.json`, and drop it into *any* project that implements this loader — not just LiveUtilities.

---

## 4. Using Theme Designer Pro to Design Themes for Your Project

You don't need to fork or modify Theme Designer Pro. The web tool at the live URL is generic:

1. Open the live tool (or `ThemeDesigner.html` locally).
2. Pick a base theme close to your desired look and tweak variables with the color pickers — the live preview updates instantly.
3. **Export a single theme** → `.theme.json` if your app has its own theme-loading UI (Step 5 above).
4. **Export the full stylesheet** → `style.css` if you want a complete drop-in replacement CSS file containing all your themes plus generic layout rules — useful as a starting point for a new project, less useful if you already have your own component styles (you'll want to merge just the `:root` / `[data-theme]` blocks, not the whole file).

If you only care about the variable *values*, ignore the rest of the exported CSS and copy just the `:root { ... }` and `[data-theme="..."] { ... }` blocks into your own stylesheet.

---

## 5. Contrast Checking (WCAG)

Theme Designer Pro includes a built-in WCAG contrast checker (see `parseColor`, `contrastRatio`, `runContrastChecks` in `ThemeDesigner.html`). While you're editing a theme, each color-picker row shows a small pass/fail badge, and the header shows a running warning count for the active theme.

**What it checks:** a fixed list of semantic foreground/background pairs that matter for this UI — body text, row text, input text/placeholder, tab text, button text against both the base and hover background, status/banner text, and a handful of non-text UI boundaries (input borders, the general border color, the banner border). Each pair is checked against WCAG 2.x thresholds: 4.5:1 for normal text, 3:1 for large text or non-text UI components.

**What it doesn't check:** anything not in that pair list (a project-specific variable you add isn't automatically covered), colors expressed as named CSS colors or gradients (reported **Unsupported**), and any pair where either color has partial alpha (reported **Unevaluated** — the checker won't guess what it composites against). A theme with zero warnings has no *known* contrast failures in the checked pairs; it is not a certification that the whole UI is accessible. Keyboard navigation, screen-reader semantics, focus order, and touch-target sizing are outside what a color-contrast checker can verify.

If you're integrating this standard into another project and want the same checks, the pair list and math are self-contained pure functions with no DOM dependency — copy `parseColor`/`relativeLuminance`/`contrastRatio`/`classifyContrast`/`CONTRAST_PAIRS` out of `ThemeDesigner.html` and adapt the pair list to your own token names.

---

## 6. Checklist for AI Coding Assistants

When asked to "add Theme Designer Pro theming" or "make this UI themeable using the Theme Designer standard" to a project:

1. **Audit** the target CSS/inline styles for hardcoded colors, fonts, and border values.
2. **Introduce variables** using the `--{category}-{role}` naming convention above; reuse the standard names where they map cleanly, add new ones (following the same pattern) for anything project-specific (e.g. `--sidebar-bg`).
3. **Write a `:root` block** with the project's current/default look as the values — this preserves the existing visual design as "Default Light" / "Default".
4. **Add a `data-theme` toggle mechanism** (dropdown, settings menu, OS theme detection, etc.) that calls `setAttribute('data-theme', name)` on `<body>` or `<html>`.
5. **Do not** hardcode a second theme's colors unless asked — ask the user whether they want a starter Dark theme, or want to design themes themselves via the Theme Designer Pro tool afterward.
6. **Persist** the selection using the storage mechanism idiomatic to that project (localStorage for web, config file for Electron/desktop, host-app storage for embedded palettes like Fusion).
7. If the project already has a design system / CSS-in-JS / Tailwind setup, prefer mapping Theme Designer variables to that system's existing tokens rather than introducing a parallel one — flag the conflict to the user instead of silently choosing.
8. Verify by toggling `data-theme` in devtools and confirming every themed element visually updates — a variable that isn't referenced anywhere in CSS is a sign Step 1 missed a hardcoded value.
9. **Define a button's foreground with its own `-text` variable** (e.g. `--btn-primary-text`) rather than assuming white — a bright or pastel accent color often needs dark text instead.
10. **Add a visible focus treatment** (`:focus-visible` with a `--focus-ring` variable, or equivalent) for buttons, tabs, inputs, and other interactive elements — don't leave keyboard focus invisible, and don't remove a browser-default focus outline without replacing it.
11. **Validate known foreground/background pairs** against WCAG contrast thresholds where practical (see Section 5) — but don't claim a theme or UI is "accessible" solely because the pairs you happened to check passed; say what was checked, not that everything was.
12. **Don't silently change typography** (font family, base size) when the user only asked for color theming — those are a separate concern from a color palette, even though this repo's own bundled themes currently couple them (see `CLAUDE.md`).
13. **Verify theme switching and saved preferences still work** after any change — toggling `data-theme` should update every themed element, and a previously saved theme choice should still apply on reload.

---

## 7. FAQ

**Does this require a build step or npm package?**
No. It's plain CSS custom properties and one `data-theme` attribute. Works with vanilla JS, React, Vue, Svelte, or a raw `<script>` tag — the mechanism is identical because it's a CSS/DOM feature, not a JS library.

**Can I use this in a non-browser context (e.g., Qt, native app WebView)?**
Yes, as long as the rendering engine is a standards-compliant browser engine (Chromium/WebKit-based WebViews, Fusion's Chromium Embedded Framework palettes, Electron, Tauri, etc.) — CSS custom properties and attribute selectors are universally supported.

**What if my project uses Tailwind/CSS-in-JS/styled-components?**
Define the same variables in your global stylesheet or theme provider, then reference them via `var(--btn-primary)` inside your utility classes or styled-component templates. The `data-theme` attribute switch still works the same way underneath any of these.

**Where's the reference implementation?**
See [ThemeDesigner.html](ThemeDesigner.html) (`updateStyleTag()`, `changeTheme()`, `parseStyleCSS()`) and [style.css](style.css) in this repo for a complete worked example of the pattern described above.
