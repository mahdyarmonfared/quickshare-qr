/**
 * Get context-aware SVG icon based on file extension
 */
function getFileIconSvg(ext) {
  const cleanExt = (ext || '').toLowerCase().replace(/^\./, '');

  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(cleanExt)) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>`;
  }

  // Videos
  if (['mp4', 'mkv', 'mov', 'webm', 'avi'].includes(cleanExt)) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="20" height="15" x="2" y="4.5" rx="2.5" ry="2.5"/>
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/>
    </svg>`;
  }

  // Audio
  if (['mp3', 'wav', 'flac', 'm4a', 'ogg', 'aac'].includes(cleanExt)) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>`;
  }

  // Code & Config
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'json', 'html', 'css', 'rs', 'go', 'sh'].includes(cleanExt)) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>`;
  }

  // Archives
  if (['zip', 'tar', 'gz', '7z', 'rar', 'bz2'].includes(cleanExt)) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 8v13H3V8"/>
      <path d="M1 3h22v5H1z"/>
      <path d="M10 12h4"/>
    </svg>`;
  }

  // Documents & Text
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'csv', 'xlsx'].includes(cleanExt)) {
    return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>`;
  }

  // Default File
  return `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>`;
}

/**
 * Render sleek, dark-mode mobile-friendly download landing page
 */
export function renderDownloadPage({ fileName, fileSizeFormatted, extension }) {
  const iconSvg = getFileIconSvg(extension);
  const extLabel = (extension ? extension.replace(/^\./, '') : 'FILE').toUpperCase();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Download ${fileName} • QuickShare</title>
  <style>
    :root {
      --bg: #07090e;
      --card-bg: rgba(15, 23, 42, 0.75);
      --card-border: rgba(255, 255, 255, 0.09);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --accent: #38bdf8;
      --accent-hover: #0ea5e9;
      --accent-glow: rgba(56, 189, 248, 0.28);
      --success: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: radial-gradient(circle at 50% 0%, #1e293b 0%, var(--bg) 75%);
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      padding-bottom: max(24px, env(safe-area-inset-bottom));
      overflow-x: hidden;
    }

    .peer-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      color: #6ee7b7;
      margin-bottom: 20px;
      letter-spacing: 0.02em;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--card-border);
      border-radius: 28px;
      padding: 40px 28px 32px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 
        0 24px 48px -12px rgba(0, 0, 0, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
      position: relative;
    }

    .icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 22px;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(37, 99, 235, 0.1));
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: var(--accent);
      margin-bottom: 24px;
      box-shadow: 0 8px 24px rgba(56, 189, 248, 0.15);
    }

    h1 {
      font-size: 21px;
      font-weight: 700;
      color: #ffffff;
      word-break: break-word;
      line-height: 1.35;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }

    .meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }

    .meta-pill span.dot {
      color: var(--accent);
      font-size: 10px;
    }

    .btn-download {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      min-height: 54px;
      background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
      color: #041325;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      padding: 16px 24px;
      border-radius: 16px;
      box-shadow: 0 8px 24px var(--accent-glow);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      border: none;
      cursor: pointer;
    }

    .btn-download:hover {
      background: linear-gradient(135deg, #7dd3fc 0%, #0369a1 100%);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(56, 189, 248, 0.4);
    }

    .btn-download:active {
      transform: scale(0.98);
    }

    .btn-download.success {
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      color: #ffffff;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
    }

    .footer {
      margin-top: 24px;
      font-size: 12.5px;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-align: center;
    }

    .footer svg {
      color: #38bdf8;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="peer-badge">
    <span class="pulse-dot"></span>
    <span>Wi-Fi Peer Ready</span>
  </div>

  <div class="card">
    <div class="icon-wrapper">
      ${iconSvg}
    </div>

    <h1>${fileName}</h1>

    <div class="meta-pill">
      <span>${fileSizeFormatted}</span>
      <span class="dot">●</span>
      <span>${extLabel}</span>
    </div>

    <a href="/download" class="btn-download" id="dl-btn">
      <svg id="dl-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span id="dl-text">Download to Device</span>
    </a>
  </div>

  <div class="footer">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <span>Direct Local Transfer • Private & Cloud-Free</span>
  </div>

  <script>
    const btn = document.getElementById('dl-btn');
    const dlText = document.getElementById('dl-text');
    const dlIcon = document.getElementById('dl-icon');

    btn.addEventListener('click', () => {
      btn.classList.add('success');
      dlText.textContent = 'Transfer Started...';
      dlIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';

      setTimeout(() => {
        btn.classList.remove('success');
        dlText.textContent = 'Download to Device Again';
        dlIcon.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
      }, 3500);
    });
  </script>
</body>
</html>`;
}
