/**
 * Render sleek, dark-mode mobile-friendly download landing page
 */
export function renderDownloadPage({ fileName, fileSizeFormatted, extension }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download ${fileName} • QuickShare</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(22, 27, 34, 0.85);
      --border: rgba(255, 255, 255, 0.1);
      --text: #f0f6fc;
      --text-muted: #8b949e;
      --accent: #38bdf8;
      --accent-hover: #0ea5e9;
      --accent-glow: rgba(56, 189, 248, 0.35);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: radial-gradient(circle at top, #161f38, var(--bg));
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px 28px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .icon-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: var(--accent);
      font-size: 32px;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 20px;
      font-weight: 700;
      word-break: break-word;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .meta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 32px;
    }

    .meta span.dot {
      color: var(--accent);
    }

    .btn-download {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: var(--accent);
      color: #030712;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      padding: 16px 24px;
      border-radius: 14px;
      box-shadow: 0 8px 24px var(--accent-glow);
      transition: all 0.2s ease;
    }

    .btn-download:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px var(--accent-glow);
    }

    .btn-download:active {
      transform: translateY(0);
    }

    .footer {
      margin-top: 24px;
      font-size: 13px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .footer span.secure {
      color: #34d399;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-badge">📦</div>
    <h1>${fileName}</h1>
    <div class="meta">
      <span>${fileSizeFormatted}</span>
      <span class="dot">•</span>
      <span>${extension.toUpperCase() || 'FILE'}</span>
    </div>

    <a href="/download" class="btn-download" id="dl-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>Download to Device</span>
    </a>
  </div>

  <div class="footer">
    <span class="secure">🔒</span>
    <span>Encrypted & Transferring over local Wi-Fi</span>
  </div>

  <script>
    const btn = document.getElementById('dl-btn');
    btn.addEventListener('click', () => {
      btn.innerHTML = '<span>⚡ Downloading...</span>';
    });
  </script>
</body>
</html>`;
}
