// Standalone test for the WCAG contrast engine in ThemeDesigner.html.
// Zero dependencies, no framework — run with: node tests/contrast.test.js
//
// The functions below are a deliberate duplicate of the pure-math block in ThemeDesigner.html
// (parseColor / relativeLuminance / contrastRatio / classifyContrast / checkContrastPair, plus the
// suggest-a-fix helpers rgbToHsl / hslToRgb / rgbToHex / computeSuggestedColor). It's stable, small,
// dependency-free math, and keeping it duplicated avoids splitting the app into multiple files just
// for testability (see CLAUDE.md: single-file, zero-dependency architecture is intentional). If you
// change the math in ThemeDesigner.html, mirror the change here.

function parseColor(str) {
    if (!str) return null;
    str = str.trim();
    if (str.toLowerCase() === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

    if (str[0] === '#') {
        let hex = str.slice(1);
        if (hex.length === 3 || hex.length === 4) hex = hex.split('').map(c => c + c).join('');
        if ((hex.length !== 6 && hex.length !== 8) || !/^[0-9a-fA-F]+$/.test(hex)) return null;
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
            a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
        };
    }

    const rgbMatch = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10),
            a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1
        };
    }

    return null;
}

function relativeLuminance({ r, g, b }) {
    const chan = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function contrastRatio(colorA, colorB) {
    const l1 = relativeLuminance(colorA);
    const l2 = relativeLuminance(colorB);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function classifyContrast(ratio, role) {
    if (ratio >= 4.5) return 'pass-aa';
    if (role === 'normal-text' && ratio >= 3) return 'pass-large';
    if (role === 'ui-component' && ratio >= 3) return 'pass-aa';
    return 'fail';
}

function checkContrastPair(fgValue, bgValue, role) {
    const fg = parseColor(fgValue);
    const bg = parseColor(bgValue);
    if (!fg || !bg || fg.a < 1 || bg.a < 1) return { status: 'unevaluated', ratio: null };
    const ratio = contrastRatio(fg, bg);
    return { status: classifyContrast(ratio, role), ratio };
}

function rgbToHsl({ r, g, b }) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4;
        }
        h /= 6;
    }
    return { h, s, l };
}

function hslToRgb({ h, s, l }) {
    if (s === 0) {
        const v = Math.round(l * 255);
        return { r: v, g: v, b: v };
    }
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
        r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        g: Math.round(hue2rgb(p, q, h) * 255),
        b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    };
}

function rgbToHex({ r, g, b }) {
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

function computeSuggestedColor(fgColor, constraints) {
    if (!constraints.length) return null;
    const worstScore = (rgb) => Math.min(...constraints.map(c => contrastRatio(rgb, c.bg) / c.threshold));
    if (worstScore(fgColor) >= 1) return null;

    const hsl = rgbToHsl(fgColor);
    const search = (dir) => {
        for (let step = 1; step <= 100; step++) {
            const l = hsl.l + dir * step * 0.01;
            if (l < 0 || l > 1) return null;
            const candidate = hslToRgb({ h: hsl.h, s: hsl.s, l });
            if (worstScore(candidate) >= 1) return { l, rgb: candidate };
        }
        return null;
    };

    const lighter = search(1);
    const darker = search(-1);
    let chosen = null;
    if (lighter && darker) {
        chosen = Math.abs(lighter.l - hsl.l) <= Math.abs(darker.l - hsl.l) ? lighter : darker;
    } else {
        chosen = lighter || darker;
    }
    return chosen ? rgbToHex(chosen.rgb) : null;
}

// --- Minimal assertion harness ---
let passCount = 0;
let failCount = 0;

function assertEqual(actual, expected, message) {
    const ok = actual === expected;
    if (ok) {
        passCount++;
    } else {
        failCount++;
        console.error(`FAIL: ${message}\n  expected: ${expected}\n  actual:   ${actual}`);
    }
}

function assertClose(actual, expected, tolerance, message) {
    const ok = actual !== null && Math.abs(actual - expected) <= tolerance;
    if (ok) {
        passCount++;
    } else {
        failCount++;
        console.error(`FAIL: ${message}\n  expected: ~${expected} (+/-${tolerance})\n  actual:   ${actual}`);
    }
}

function assertNull(actual, message) {
    assertEqual(actual, null, message);
}

// --- parseColor: supported formats ---
assertEqual(JSON.stringify(parseColor('#fff')), JSON.stringify({ r: 255, g: 255, b: 255, a: 1 }), 'parseColor #fff (hex3)');
assertEqual(JSON.stringify(parseColor('#ffff')), JSON.stringify({ r: 255, g: 255, b: 255, a: 1 }), 'parseColor #ffff (hex4)');
assertEqual(JSON.stringify(parseColor('#ffffff')), JSON.stringify({ r: 255, g: 255, b: 255, a: 1 }), 'parseColor #ffffff (hex6)');
assertEqual(JSON.stringify(parseColor('#ffffffff')), JSON.stringify({ r: 255, g: 255, b: 255, a: 1 }), 'parseColor #ffffffff (hex8, full alpha)');
assertEqual(JSON.stringify(parseColor('#00000080')), JSON.stringify({ r: 0, g: 0, b: 0, a: 128 / 255 }), 'parseColor #00000080 (hex8, half alpha)');
assertEqual(JSON.stringify(parseColor('rgb(255, 255, 255)')), JSON.stringify({ r: 255, g: 255, b: 255, a: 1 }), 'parseColor rgb(255,255,255)');
assertEqual(JSON.stringify(parseColor('rgba(0, 0, 0, 0.6)')), JSON.stringify({ r: 0, g: 0, b: 0, a: 0.6 }), 'parseColor rgba(0,0,0,0.6)');
assertEqual(JSON.stringify(parseColor('transparent')), JSON.stringify({ r: 0, g: 0, b: 0, a: 0 }), 'parseColor transparent');

// --- parseColor: unsupported / invalid input -> null ---
assertNull(parseColor('red'), 'parseColor named color "red" is unsupported');
assertNull(parseColor('rebeccapurple'), 'parseColor named color "rebeccapurple" is unsupported');
assertNull(parseColor('linear-gradient(#fff, #000)'), 'parseColor gradient is unsupported');
assertNull(parseColor('var(--btn-primary)'), 'parseColor unresolved var() is unsupported');
assertNull(parseColor('#gggggg'), 'parseColor invalid hex characters');
assertNull(parseColor('#12345'), 'parseColor invalid hex length');
assertNull(parseColor(''), 'parseColor empty string');
assertNull(parseColor(null), 'parseColor null input');
assertNull(parseColor(undefined), 'parseColor undefined input');

// --- Reference contrast ratios ---
assertClose(contrastRatio(parseColor('#000000'), parseColor('#ffffff')), 21, 0.01, 'black on white = 21:1');
assertClose(contrastRatio(parseColor('#ffffff'), parseColor('#ffffff')), 1, 0.01, 'white on white = 1:1');

// --- Threshold boundary behavior ---
assertEqual(classifyContrast(4.5, 'normal-text'), 'pass-aa', '4.5:1 normal-text is exactly AA');
assertEqual(classifyContrast(4.49, 'normal-text'), 'pass-large', '4.49:1 normal-text just misses AA, still clears large-text');
assertEqual(classifyContrast(3, 'normal-text'), 'pass-large', '3:1 normal-text is exactly the large-text floor');
assertEqual(classifyContrast(2.99, 'normal-text'), 'fail', '2.99:1 normal-text fails everything');
assertEqual(classifyContrast(3, 'ui-component'), 'pass-aa', '3:1 ui-component meets its own AA threshold');
assertEqual(classifyContrast(2.99, 'ui-component'), 'fail', '2.99:1 ui-component fails');

// --- Alpha handling: unevaluated, not guessed ---
assertEqual(checkContrastPair('rgba(0,0,0,0.6)', '#ffffff', 'normal-text').status, 'unevaluated', 'alpha < 1 foreground is unevaluated, not composited');
assertEqual(checkContrastPair('#000000', 'rgba(255,255,255,0.5)', 'normal-text').status, 'unevaluated', 'alpha < 1 background is unevaluated, not composited');
assertEqual(checkContrastPair('red', '#ffffff', 'normal-text').status, 'unevaluated', 'unsupported color format is unevaluated, not a silent pass');

// --- Regression anchors: real bundled-theme values (computed during planning) ---
// Ocean's original hardcoded white button text failed outright; the fix (black text) passes.
assertClose(contrastRatio(parseColor('#ffffff'), parseColor('#0ea5e9')), 2.77, 0.02, 'Ocean btn-primary vs white text (pre-fix) ~2.77:1');
assertEqual(checkContrastPair('#ffffff', '#0ea5e9', 'normal-text').status, 'fail', 'Ocean btn-primary vs white text (pre-fix) fails AA');
assertEqual(checkContrastPair('#000000', '#0ea5e9', 'normal-text').status, 'pass-aa', 'Ocean btn-primary vs black text (post-fix) passes AA');

// Classic Dark's white button text already passed and must keep passing (regression guard).
assertClose(contrastRatio(parseColor('#ffffff'), parseColor('#0069d9')), 5.22, 0.02, 'Classic Dark btn-primary vs white text ~5.22:1');
assertEqual(checkContrastPair('#ffffff', '#0069d9', 'normal-text').status, 'pass-aa', 'Classic Dark btn-primary vs white text passes AA');

// Hot Pink's original hardcoded white success-button text failed outright; the fix (black text) passes.
assertEqual(checkContrastPair('#ffffff', '#29a6a8', 'normal-text').status, 'fail', 'Hot Pink btn-success vs white text (pre-fix) fails AA');
assertEqual(checkContrastPair('#000000', '#29a6a8', 'normal-text').status, 'pass-aa', 'Hot Pink btn-success vs black text (post-fix) passes AA');

// --- rgbToHsl / hslToRgb: round-trip and known values ---
assertEqual(JSON.stringify(hslToRgb(rgbToHsl({ r: 255, g: 0, b: 0 }))), JSON.stringify({ r: 255, g: 0, b: 0 }), 'HSL round-trip: pure red');
assertEqual(JSON.stringify(hslToRgb(rgbToHsl({ r: 122, g: 122, b: 122 }))), JSON.stringify({ r: 122, g: 122, b: 122 }), 'HSL round-trip: gray (zero saturation)');
{
    const hsl = rgbToHsl({ r: 255, g: 255, b: 255 });
    assertClose(hsl.l, 1, 0.001, 'white has HSL lightness 1');
}
{
    const hsl = rgbToHsl({ r: 0, g: 0, b: 0 });
    assertClose(hsl.l, 0, 0.001, 'black has HSL lightness 0');
}

// --- computeSuggestedColor: the same-hue lightness search used by the "suggest a fix" badge link ---
{
    // Real case: Ocean's pre-fix white button text (2.77:1, fails 4.5). White can't go any *lighter*
    // (already at max lightness), but it can still be darkened — grayscale has s=0, so darkening white
    // walks straight down to black, crossing Ocean's blue on the way and eventually clearing 4.5:1 on
    // the far (darker) side. That's a legitimate minimal-change answer, and it's why the real Ocean fix
    // (manually jumping straight to pure black, 7.58:1) is a *larger* change than the algorithm needs.
    const bg = { r: 14, g: 165, b: 233 };
    const suggestion = computeSuggestedColor({ r: 255, g: 255, b: 255 }, [{ bg, threshold: 4.5 }]);
    const ratio = contrastRatio(parseColor(suggestion), bg);
    assertEqual(ratio >= 4.5, true, `computeSuggestedColor(white on Ocean blue) -> ${suggestion} (${ratio.toFixed(2)}:1) clears 4.5:1 by darkening past the background`);
}
{
    // Synthetic case: a mid-gray text on white that fails AA should get darkened until it passes.
    // The search steps in fixed lightness increments, so it can overshoot the threshold slightly —
    // the real invariant is "at least 4.5:1", not "exactly 4.5:1".
    const fg = { r: 170, g: 170, b: 170 }; // #aaaaaa, matches Default Light's pre-fix placeholder
    const bg = { r: 255, g: 255, b: 255 };
    const suggestion = computeSuggestedColor(fg, [{ bg, threshold: 4.5 }]);
    const ratio = contrastRatio(parseColor(suggestion), bg);
    assertEqual(ratio >= 4.5, true, `computeSuggestedColor(#aaaaaa on white) -> ${suggestion} (${ratio.toFixed(2)}:1) clears 4.5:1`);
}
{
    // A color that already passes should have nothing suggested.
    const suggestion = computeSuggestedColor({ r: 0, g: 0, b: 0 }, [{ bg: { r: 255, g: 255, b: 255 }, threshold: 4.5 }]);
    assertNull(suggestion, 'computeSuggestedColor returns null when the color already passes');
}
{
    // Multiple constraints (e.g. a button's base + hover background) must all be satisfied at once.
    const fg = { r: 170, g: 170, b: 170 };
    const constraints = [
        { bg: { r: 255, g: 255, b: 255 }, threshold: 4.5 },
        { bg: { r: 230, g: 230, b: 230 }, threshold: 4.5 } // slightly harder (closer to the gray fg)
    ];
    const suggestion = computeSuggestedColor(fg, constraints);
    const rgb = parseColor(suggestion);
    assertEqual(constraints.every(c => contrastRatio(rgb, c.bg) >= c.threshold - 0.01), true, `computeSuggestedColor(${suggestion}) satisfies every constraint simultaneously`);
}

console.log(`\n${passCount} passed, ${failCount} failed`);
if (failCount > 0) process.exit(1);
