# Cloaq Extended

[![GitHub Release](https://img.shields.io/github/v/release/theneet0/cloaq-extended?color=blue)](https://github.com/theneet0/cloaq-extended/releases)
[![Build and Release Extension](https://github.com/theneet0/cloaq-extended/actions/workflows/release.yml/badge.svg)](https://github.com/theneet0/cloaq-extended/actions/workflows/release.yml)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-green.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-orange.svg)](manifest.json)

**Cloaq Extended** is an advanced browser privacy and fingerprint mitigation extension for Chromium-based browsers (Google Chrome, Brave, Microsoft Edge). It dynamically aligns browser-level environment signals—including system timezone, geolocation coordinates, browser locale, HTTP `Accept-Language` headers, and physical keyboard layout—with the user's active VPN or proxy exit IP address.

---

## Technical Overview

Modern browser fingerprinting and bot detection suites (e.g., CreepJS, FingerprintJS Pro, Cloudflare Turnstile, DataDome) identify VPN and proxy users by exposing discrepancies between the network IP address and local browser environment signals. Common leakage vectors include:

* Mismatches between public IP origin and `Intl.DateTimeFormat().resolvedOptions().timeZone`.
* Leaks in `navigator.language` and `navigator.languages` exposing the underlying OS installation language.
* Discrepancies between browser locale and outbound HTTP `Accept-Language` headers.
* Physical keyboard layout enumeration via the W3C Keyboard Map API (`navigator.keyboard.getLayoutMap()`).

Cloaq Extended mitigates these vectors through a hybrid architecture combining the Chrome DevTools Protocol (`chrome.debugger`), Declarative Net Request rules, and stealth WebIDL prototype patching.

---

## Core Features

### 1. Automated VPN IP Tracking & Real-Time Sync
* Continuously monitors network gateway changes via periodic background alarms and navigation hooks.
* Multi-provider GeoIP resolution pipeline (`ipwho.is`, `ip-api.com`, `freeipapi.com`) with automated fallback and network timeout guards.
* Automatically updates time zone, geolocation, and locale across active and new tabs whenever the VPN connection switches—eliminating the need to manually toggle settings.

### 2. Browser-Level CDP Overrides
* Operates via the Chrome DevTools Protocol (`chrome.debugger`) to enforce overrides at the browser engine level:
  * `Emulation.setTimezoneOverride`: Synchronizes IANA time zone across all execution contexts.
  * `Emulation.setGeolocationOverride`: Enforces GPS coordinates and accuracy values.
  * `Emulation.setLocaleOverride`: Configures native formatting and `Intl` APIs across frames and Web Workers.

### 3. Network Header Interception
* Intercepts and rewrites outbound HTTP `Accept-Language` headers using `declarativeNetRequest` rules and CDP `Network.setExtraHTTPHeaders`.
* Ensures network requests mirror the spoofed locale with correct language tags and quality values (e.g., `de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7`).

### 4. Stealth Keyboard Layout Emulation
* Intercepts `navigator.keyboard.getLayoutMap()` to return an authentic `KeyboardLayoutMap` conforming to the physical keyboard standards of the target country.
* Supported layout profiles:
  * **German (QWERTZ)** (`de-DE`, `de-AT`, `de-CH`)
  * **French (AZERTY)** (`fr-FR`, `fr-BE`, `fr-CA`)
  * **Turkish (Q)** (`tr-TR`)
  * **United Kingdom (QWERTY)** (`en-GB`)
  * **Spanish** (`es-ES`)
  * **Italian** (`it-IT`)
  * **Russian (JCUKEN)** (`ru-RU`, `uk-UA`)
  * **United States (QWERTY)** (`en-US`)
* Designed with native prototype masking: methods are bound to `KeyboardLayoutMap.prototype`, instances contain zero enumerable own properties, and `Function.prototype.toString` calls return `[native code]` to bypass anti-tampering heuristics.

---

## Installation

### Method 1: Pre-built Release (Recommended)

1. Navigate to the **[Releases](https://github.com/theneet0/cloaq-extended/releases)** page.
2. Under **Assets** of the latest release, download `cloaq-extended.zip`.
3. Extract the downloaded zip archive to a local directory on your machine.
4. Open Google Chrome (or your Chromium-based browser) and navigate to:
   ```text
   chrome://extensions/
   ```
5. Enable **Developer mode** using the toggle in the upper-right corner.
6. Click **Load unpacked** in the top navigation bar.
7. Select the extracted folder containing `manifest.json`.
8. Pin the extension to your toolbar, open the popup, and select **Match IP Address**.

---

### Method 2: Building from Source

**Prerequisites:** Node.js (version 18 or higher) and npm.

1. Clone the repository:
   ```bash
   git clone https://github.com/theneet0/cloaq-extended.git
   cd cloaq-extended
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the automated test suite:
   ```bash
   npm test
   ```

4. Compile Tailwind CSS and bundle assets:
   ```bash
   npm run build
   ```
   *The distributable extension files are packaged into the `./build/` directory.*

5. Open `chrome://extensions/`, enable **Developer mode**, click **Load unpacked**, and select the `./build/` directory.

---

## Suppressing the Debugger Notification Banner

Because Cloaq Extended utilizes the Chromium Debugger API for robust, multi-frame emulation, Chrome displays an informational banner at the top of active tabs:

> *"Cloaq is debugging this browser"*

To permanently suppress this banner, launch Chromium with the `--silent-debugger-extension-api` command-line flag:

### Windows:
Modify your Google Chrome desktop shortcut or launch via PowerShell:
```powershell
chrome.exe --silent-debugger-extension-api
```

### macOS:
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --silent-debugger-extension-api
```

### Linux:
```bash
google-chrome --silent-debugger-extension-api
```

---

## Configuration Modes

| Mode | Description |
| :--- | :--- |
| **Match IP Address** | Queries public IP endpoints, resolves geolocation coordinates and locale, and dynamically tracks VPN switching in real time. |
| **Location Presets** | Provides over 30 predefined metropolitan profiles (e.g., London, Berlin, Paris, Tokyo, New York, Zurich). |
| **Custom** | Allows manual input of Time Zone identifier, Locale string, Latitude, and Longitude coordinates. |
| **Browser Default** | Detaches the debugger and restores native system environment settings. |

---

## Permissions Architecture

| Permission | Justification |
| :--- | :--- |
| `debugger` | Required to invoke Chrome DevTools Protocol domains (`Emulation`, `Page`, `Network`). |
| `declarativeNetRequest` | Modifies outbound `Accept-Language` HTTP request headers at the network stack. |
| `alarms` | Schedules lightweight periodic background verification of network IP transitions. |
| `webNavigation` | Detects document navigation lifecycle events to apply overrides prior to DOM script execution. |
| `storage` | Persists user preferences and cached geolocation metadata locally. |
| `host_permissions: ["<all_urls>"]` | Permits Declarative Net Request rules across all visited origins and allows background service workers to query GeoIP APIs. |

---

## Automated CI/CD Pipeline

Every push to the `main` branch triggers an automated GitHub Actions workflow (`.github/workflows/release.yml`) that:
1. Validates source integrity and runs unit tests (`npm test`).
2. Compiles production assets and minified CSS (`npm run build`).
3. Extracts the version dynamically from `manifest.json`.
4. Packages and publishes a versioned `cloaq-extended.zip` release bundle to GitHub Releases.

---

## License

This project is licensed under the terms of the GNU General Public License v3.0 ([GPL-3.0](LICENSE)).
