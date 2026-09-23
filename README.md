<div align="center">

# ⚡ QuickShare-QR

**Instant, zero-config local Wi-Fi file sharing between laptop and mobile via terminal & on-screen QR codes.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![CI Status](https://github.com/mahdyarmonfared/quickshare-qr/actions/workflows/ci.yml/badge.svg)](https://github.com/mahdyarmonfared/quickshare-qr/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com)

</div>

---

## 🧐 Why QuickShare-QR?

How often do you need to transfer a video, document, or entire folder between your laptop and smartphone?

- 🔌 **Cables:** Plugging in a USB cable and navigating MTP/Finder is cumbersome.
- 💬 **Messaging Apps:** Sending files through Telegram or WhatsApp compresses high-res media, has file size limits, and uploads your private data to external servers.
- ☁️ **Cloud Storage:** Google Drive or Dropbox require uploading to the internet first, waiting for cloud sync, and generating links.

**QuickShare-QR** spins up a micro-server on your local Wi-Fi network, prints a QR code in your terminal or on your screen, and enables ultra-fast, local bi-directional transfers. Zero internet bandwidth consumed, 100% private.

```
Laptop Terminal / Web Hub:                   Mobile Phone (Same Wi-Fi):
┌──────────────────────────────┐             ┌────────────────────────┐
│ $ quickshare video.mp4       │             │ 📷 Scan QR Code        │
│ or $ quickshare web          │             │           │            │
│                              │  ────────►  │           ▼            │
│ ▄▄▄▄▄▄▄ ▄ ▄▄▄▄ ▄▄▄▄▄▄▄       │             │ 📱 One-Tap Download    │
│ █ ▄▄▄ █ █ ▄▀▄█ █ ▄▄▄ █       │  ◄────────  │ 📸 Upload to Laptop    │
│ ▀▀▀▀▀▀▀ ▀ ▀ ▀  ▀▀▀▀▀▀▀       │             │ (Saves to ~/Downloads) │
└──────────────────────────────┘             └────────────────────────┘
```

---

## ✨ Key Features

- ⚡ **Zero-Config:** Automatically detects your active physical Wi-Fi IP (`192.168.x.x` or `10.x.x.x`), skipping VPN/virtual interfaces.
- 📱 **Terminal QR Code:** Instant scan directly from your terminal with iPhone / Android camera apps.
- 🖥️ **Desktop Web Hub (`quickshare web`):** Launch an interactive web dashboard on `localhost:3003` with on-screen SVG QR code, drag-and-drop file sharing, and live transfer feeds.
- 📂 **Directory Auto-Zipping:** Pass any folder (`quickshare ./my-project`), and QuickShare will zip and stream it on the fly with zero temporary disk usage.
- 🔄 **Bi-Directional Transfer:** Mobile users can also upload photos, videos, and documents directly back to your laptop's `~/Downloads` folder.
- 🌊 **Zero-RAM Streaming:** Built on Node.js streams and busboy; effortlessly handles multi-gigabyte 4K videos and archives without choking memory.
- 🌐 **RFC 5987 / UTF-8 Unicode Support:** Full international filename support (Persian, Arabic, Japanese, emojis) with no mangled download names.
- 🔄 **Smart Port Fallback:** Automatically increments port (`3004`, `3005`...) if default port `3003` is already occupied.
- ⏱️ **Single-Use Mode (`-o, --once`):** Automatically shuts down the server once the download finishes.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/mahdyarmonfared/quickshare-qr.git
cd quickshare-qr

# Install dependencies
npm install

# Link globally for terminal access
npm link
```

### Instant Usage

```bash
# 1. Share a single file (prints QR in terminal)
quickshare video.mp4

# 2. Share an entire folder (automatically zipped on the fly!)
quickshare ./documents

# 3. Launch the desktop Web Hub on localhost:3003 (drag & drop files)
quickshare web

# 4. Exit immediately after first mobile download
quickshare presentation.pdf --once
```

---

## 📖 CLI Usage & Options

```bash
quickshare [target] [options]
```

### Arguments

| Argument | Description | Default |
| :--- | :--- | :--- |
| `[target]` | File or folder path to share | If omitted, starts in Web Hub mode |

### Options

| Flag | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--port <number>` | `-p` | Custom port to run server on | `3003` |
| `--once` | `-o` | Shut down server automatically after first download | `false` |
| `--dir <folder>` | `-d` | Target folder for incoming phone uploads | `~/Downloads` |
| `--web` | | Explicitly launch Web Hub mode | `false` |
| `--help` | `-h` | Display help screen | |
| `--version` | `-V` | Output version number | |

---

## 🌐 Web Hub & Mobile Portal

### 💻 Laptop Web Hub (`http://localhost:3003`)
- Drag and drop any file or folder from your computer.
- Live, crisp on-screen SVG QR code for mobile scanning.
- Copyable local Wi-Fi URL.
- Live Server-Sent Events (SSE) feed notifying you when files are downloaded or uploaded.

### 📱 Mobile Download & Upload Portal
- **Receive from Laptop tab:** View file icon, formatted size, and tap "Download to Device".
- **Send to Laptop tab:** Select photos, videos, or documents on your phone and upload them at maximum Wi-Fi speed directly into your laptop's `Downloads` folder.

---

## 🧪 Running Tests

QuickShare-QR includes unit and integration tests using Node's native test runner (`node:test`):

```bash
npm test
```

---

## 📝 License

This project is open-source under the [MIT License](LICENSE).
