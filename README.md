<div align="center">

# ⚡ QuickShare-QR

**Instant, zero-config local Wi-Fi file sharing from terminal to phone via terminal QR codes.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![CI Status](https://github.com/mahdyarmonfared/quickshare-qr/actions/workflows/ci.yml/badge.svg)](https://github.com/mahdyarmonfared/quickshare-qr/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com)

</div>

---

## 🧐 Why QuickShare-QR?

How often do you need to transfer a single video, PDF, or zip file from your laptop to your smartphone?

- Plugging in a USB cable is annoying.
- Sending files through Telegram or WhatsApp compresses your media and uploads your private data to external servers.
- Cloud storage services (Google Drive / Dropbox) require uploading to the web, waiting, and creating sharing links.

**QuickShare-QR** spins up a micro-server on your local Wi-Fi network, prints a clean QR code right in your terminal, and lets your phone download the file at maximum local network speed. Zero cables, zero internet bandwidth, 100% private.

```
Laptop Terminal:                           Mobile Phone:
┌──────────────────────────────┐           ┌────────────────────────┐
│ $ quickshare video.mp4       │           │ 📷 Scan QR Code        │
│                              │           │           │            │
│ ▄▄▄▄▄▄▄ ▄ ▄▄▄▄ ▄▄▄▄▄▄▄       │  ──────►  │           ▼            │
│ █ ▄▄▄ █ █ ▄▀▄█ █ ▄▄▄ █       │           │ 📱 Open Local Page     │
│ █ ███ █ █▄█ ▄▀ █ ███ █       │           │ 📦 Download (Max Speed)│
│ ▀▀▀▀▀▀▀ ▀ ▀ ▀  ▀▀▀▀▀▀▀       │           └────────────────────────┘
└──────────────────────────────┘
```

---

## ✨ Features

- ⚡ **Zero-Config:** Automatically detects your local Wi-Fi IP address (`192.168.x.x`).
- 📱 **Terminal QR Code:** Scan directly with your iPhone or Android camera app.
- 🎨 **Sleek Mobile Landing Page:** Responsive dark-mode interface with file metadata and download button.
- 🌊 **Stream-Based Transfer:** Handles gigabyte-sized files smoothly without high RAM usage.
- 🔒 **100% Private & Local:** Data never leaves your local Wi-Fi network.
- ⏱️ **Single-Use Mode (`-o, --once`):** Automatically terminates the server after the download finishes.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/mahdyarmonfared/quickshare-qr.git
cd quickshare-qr

# Install dependencies
npm install

# Link globally (optional)
npm link
```

### Direct Run

```bash
# Share any file instantly
node bin/quickshare.js /path/to/my-video.mp4

# Or if linked globally:
quickshare document.pdf
```

---

## 📖 CLI Usage & Options

```bash
quickshare <file> [options]
```

### Options

| Flag | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--port <number>` | `-p` | Custom port to run the server on | `3000` |
| `--once` | `-o` | Shut down server automatically after 1 download | `false` |
| `--help` | `-h` | Display help screen | |
| `--version` | `-V` | Output version number | |

### Examples

#### 1. Share a photo to your phone:
```bash
quickshare photo.jpg
```

#### 2. Send an archive and exit immediately after download:
```bash
quickshare project.zip --once
```

#### 3. Run on a specific port:
```bash
quickshare invoice.pdf -p 8080
```

---

## 🧪 Running Tests

QuickShare-QR uses Node's native test runner (`node:test`):

```bash
npm test
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Check the [contributing guidelines](CONTRIBUTING.md) and [issues page](https://github.com/mahdyarmonfared/quickshare-qr/issues).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
