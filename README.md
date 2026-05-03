# 🎨 Theme Designer Pro

**Version:** 1.0.1

**Author:** Ed Johnson (Making With An EdJ)

**A web-based visual theme editor and companion tool for Autodesk Fusion Add-ins.**

**[👉 CLICK HERE TO USE THE LIVE THEME DESIGNER](https://edjohnson100.github.io/ThemeDesigner/)**

---
## ✨ What's New in v1.0.1

* **Theme accent border:** Exported `style.css` files now include a subtle primary-color border on the palette body. If you import an older `style.css` that is missing the border, Theme Designer will automatically add it when you export again — no manual editing required.

---

## Introduction

Theme Designer Pro is a standalone, purely client-side web application designed to generate, manage, and edit custom CSS/JSON themes. 

While it can be adapted for any web project, it was specifically built as a companion tool for **[LiveUtilities](https://github.com/edjohnson100/LiveUtilities)** (and other Fusion add-ins) to allow users to customize their HTML palette UIs without having to write a single line of CSS.

## Features

* **Live Preview Environment:** Tweak a color variable and instantly see how it affects inputs, dropdowns, tabs, sliders, and modal dialogs.
* **Smart Highlighting:** Click any element in the live preview, and the designer will automatically highlight the corresponding CSS variables you need to change.
* **Full CSS Export:** Generate a complete `style.css` file combining base layout rules with all of your custom themes.
* **Modular JSON Export:** Export a single theme as a lightweight `.theme.json` file that can be instantly imported into the LiveUtilities Theme Manager.
* **Zero Dependencies:** Pure HTML, CSS, and Vanilla JavaScript. No servers, no build steps, no databases.

---

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
* **License:** Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
* **Lucy (The Cavachon Puppy):**
  ***Chief Wellness Officer & Director of Mandatory Breaks***

---

*If you find this tool useful for your own Add-in development or parametric workflows, feel free to **[buy Lucy a dog treat on Ko-fi](https://ko-fi.com/makingwithanedj)**!

***

*Happy Making!*
*— EdJ*
