# DarQode – Dark Mode for Qlik Sense Data Load Editor

> 💻 *Dark mode for coders who Qlik.*

**DarQode** is a Chrome extension that brings an elegant dark theme to the Qlik Sense **Data Load Editor** (DLE). 
Built for clarity, comfort, and a smoother coding experience, it supports both **Qlik Cloud** and **on-premise** environments with a VS Code-inspired aesthetic.

---

## ⚠️ Disclaimer

**DarQode** is an independent project and is **not affiliated with, endorsed by, or sponsored by Qlik®.**  
All trademarks, including “Qlik” and “Qlik Sense,” are the property of their respective owners and are used here solely for descriptive purposes.

---

## 🚀 Features

- 🌙 **Complete Dark Theme** – Transforms the full DLE interface
- 🎨 **Syntax Highlighting** – Developer-friendly VS Code–style palette
- 🔧 **UI Styling** – Dark styling for buttons, inputs, connectors, and dialogs
- 📱 **Responsive** – Works smoothly across all screen sizes
- ⚡ **Auto Detection** – Activates only on Qlik Data Load Editor pages
- 🎯 **Toggle Controls** – Toggle via popup or floating moon button
- ☁️ **Hybrid Support** – Compatible with Qlik Cloud and on-prem environments

---

## ❓ Why Use DarQode?

- Reduce eye strain during long data modeling sessions
- Stay focused with a high-contrast, VS Code–inspired theme
- Improve readability of long scripts and large expressions
- Smoothly supports both Qlik Cloud and on-premise environments

---

## ⚠️ Known Limitations

- The dark mode **does not fully apply** to the following Qlik Cloud screens:
  - **"Add from Data Catalog"** dialog
  - **Create New Task** (App details → Schedule)
  - **App Settings** (new screen)
  - **Publish App** (App details → Publish)

💡 *These are known issues and are planned for resolution in the next version.*

- Some **minor UI elements** may still appear in light mode. If found, they’ll be addressed in future updates.

---

## 🧩 Installation

### From Chrome Web Store (Recommended)
🛒 **[Install DarQode from Chrome Web Store](https://chromewebstore.google.com/detail/lcdeekeamnlnehjedohcijcaoadgiboe?utm_source=item-share-cb)**

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the extension folder

---

## ✅ Tested Versions

DarQode is tested and verified to work on the following Qlik Sense versions:

- **Qlik Sense Enterprise on Windows**
  - May 2024
  - November 2024
  - May 2025
- **Qlik Cloud** (SaaS)

Both on-premise and cloud interfaces are supported and styled consistently.

---

## 💡 Usage

### Automatic Activation
DarQode automatically detects Qlik Sense DLE pages and applies the dark theme.

### Manual Toggle
- **Via Extension Popup** – Click the toolbar icon and use the toggle
- **Via Floating Button** – Use the 🌓 button in the top-right corner of the DLE

### Supported Pages
- Qlik Sense Data Load Editor (Cloud + On-Prem)

---

## 🧱 Technical Overview

### 📁 File Structure
```
darqode/
├── manifest.json
├── content.js
├── dark-theme.css
├── popup.html
├── popup.js
├── background.js
├── logo.png
├── icons/
└── README.md
```

### 🎨 CSS Variables
```css
:root {
  --dark-bg: #090E16;
  --dark-text: #e0e0e0;
  --border-color: #333;
  --highlight: rgba(38, 79, 120, 0.7);
}
```

### ⚙️ Content Script Highlights
- SPA-aware URL change detection
- Dark mode injection into modals and iframes
- Persistent user preferences via `chrome.storage`
- Dynamic styling via MutationObserver

### 🪟 Popup Features
- Shows current status (on/off)
- Detects if user is on a Qlik DLE page
- Toggle switch with error feedback

---

## 🌐 Browser Compatibility

- ✅ Chrome – Fully supported (Manifest V3)
- ✅ Edge – Fully supported (Chromium-based)
- ❌ Firefox – Not supported (different extension model)

---

## 🔐 Permissions

This extension requests:
- `activeTab` – To detect and modify the Qlik page
- `storage` – To save your dark mode preferences
- `host_permissions` – To access both Qlik Cloud and on-prem domains

> 🔒 DarQode does not collect or transmit any personal data.

---

## 🛠️ Development

### Build & Test
1. Clone this repository
2. Make your changes
3. Load via `chrome://extensions` in developer mode
4. Zip the folder for distribution

### Customize Theme
Edit variables in `dark-theme.css`:
```css
:root {
  --dark-bg: #your-color;
  --dark-text: #your-text-color;
}
```

### Add New Selectors
1. Use devtools to inspect Qlik elements
2. Add CSS rules to `dark-theme.css`
3. Test across Cloud and on-prem

---

## 🤝 Contributing

We welcome:
- 🐛 Bug fixes
- 💡 Feature ideas
- 🎨 UI improvements
- ✅ New Qlik section support

Open an issue or submit a PR!

---

## 📜 License

MIT License – see the [LICENSE](./LICENSE) file.

---

## 🆘 Support

Try this first:
1. Ensure you’re on a Qlik Data Load Editor page
2. Refresh the browser tab
3. Disable and re-enable the extension
4. Check the dev console for errors

Still having trouble?  
📧 Contact me at [eligohar85@gmail.com](mailto:eligohar85@gmail.com)  
💬 Or reach out on [LinkedIn](https://www.linkedin.com/in/eligohar)

> 🌍 Check the GitHub project: https://github.com/EliGohar85/DarQode

---

## 📦 Changelog

### v1.0.0 – Initial Release
- Full dark mode styling for Qlik Sense DLE
- Toggle controls via popup and floating button
- Supports Qlik Cloud and on-prem environments
