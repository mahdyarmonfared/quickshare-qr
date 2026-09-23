/**
 * QuickShare-QR Templates
 * Mobile Download & Upload Portal + Desktop Web Hub
 */

/**
 * Get context-aware SVG icon based on file extension
 */
export function getFileIconSvg(ext, isFolder = false) {
  if (isFolder) {
    return `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>`;
  }

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
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'json', 'html', 'css', 'rs', 'go', 'sh', 'sql', 'yaml', 'yml'].includes(cleanExt)) {
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
 * Render mobile-friendly download & upload landing page
 */
export function renderDownloadPage({ fileName, fileSizeFormatted, extension, isDirectory = false, hostIp, port }) {
  const iconSvg = getFileIconSvg(extension, isDirectory);
  const extLabel = isDirectory ? 'FOLDER (ZIP)' : (extension ? extension.replace(/^\./, '') : 'FILE').toUpperCase();
  const hasFile = Boolean(fileName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>QuickShare • ${hasFile ? fileName : 'Local Transfer'}</title>
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
      margin-bottom: 16px;
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

    .nav-tabs {
      display: flex;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 4px;
      margin-bottom: 20px;
      width: 100%;
      max-width: 420px;
    }

    .tab-btn {
      flex: 1;
      padding: 9px 12px;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent);
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .card {
      background: var(--card-bg);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--card-border);
      border-radius: 28px;
      padding: 36px 28px 32px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 
        0 24px 48px -12px rgba(0, 0, 0, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
      position: relative;
    }

    .tab-panel {
      display: none;
    }

    .tab-panel.active {
      display: block;
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
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(56, 189, 248, 0.15);
    }

    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      word-break: break-word;
      line-height: 1.35;
      margin-bottom: 10px;
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
      margin-bottom: 28px;
    }

    .meta-pill span.dot {
      color: var(--accent);
      font-size: 10px;
    }

    .btn-action {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      min-height: 52px;
      background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
      color: #041325;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      padding: 14px 24px;
      border-radius: 16px;
      box-shadow: 0 8px 24px var(--accent-glow);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      border: none;
      cursor: pointer;
    }

    .btn-action:hover {
      background: linear-gradient(135deg, #7dd3fc 0%, #0369a1 100%);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(56, 189, 248, 0.4);
    }

    .btn-action:active {
      transform: scale(0.98);
    }

    .btn-action.success {
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      color: #ffffff;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
    }

    /* Upload Form Styles */
    .upload-zone {
      border: 2px dashed rgba(56, 189, 248, 0.3);
      border-radius: 18px;
      padding: 26px 16px;
      background: rgba(0, 0, 0, 0.2);
      cursor: pointer;
      margin-bottom: 20px;
      transition: all 0.2s;
    }

    .upload-zone:hover, .upload-zone.drag-active {
      border-color: var(--accent);
      background: rgba(56, 189, 248, 0.08);
    }

    .upload-zone svg {
      color: var(--accent);
      margin-bottom: 10px;
    }

    .upload-title {
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 4px;
    }

    .upload-subtitle {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .selected-files-list {
      text-align: left;
      margin-bottom: 16px;
      font-size: 13px;
      color: #e2e8f0;
      max-height: 120px;
      overflow-y: auto;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 14px;
      display: none;
    }

    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #38bdf8, #10b981);
      transition: width 0.2s ease;
    }

    .upload-status {
      margin-top: 12px;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .footer {
      margin-top: 24px;
      font-size: 12px;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-align: center;
    }

    @media (max-width: 480px) {
      body {
        padding: 16px 12px;
        padding-bottom: max(16px, env(safe-area-inset-bottom));
      }
      .card {
        padding: 26px 16px 22px;
        border-radius: 20px;
      }
      .icon-wrapper {
        width: 70px;
        height: 70px;
        border-radius: 18px;
        margin-bottom: 16px;
      }
      h1 {
        font-size: 18px;
        line-height: 1.3;
        margin-bottom: 8px;
        overflow-wrap: anywhere;
        word-break: break-word;
      }
      .meta-pill {
        margin-bottom: 20px;
        font-size: 12px;
        padding: 4px 10px;
      }
      .nav-tabs {
        margin-bottom: 16px;
      }
      .tab-btn {
        font-size: 12px;
        padding: 8px 6px;
      }
      .btn-action {
        font-size: 15px;
        min-height: 48px;
        padding: 12px 18px;
        border-radius: 14px;
      }
      .upload-zone {
        padding: 20px 12px;
        border-radius: 14px;
      }
      .upload-title {
        font-size: 14px;
      }
      .upload-subtitle {
        font-size: 11.5px;
      }
    }

    @media (max-width: 360px) {
      .card {
        padding: 20px 12px 16px;
      }
      h1 {
        font-size: 16px;
      }
      .tab-btn {
        font-size: 11px;
        padding: 6px 4px;
      }
      .icon-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="peer-badge">
    <span class="pulse-dot"></span>
    <span>Wi-Fi Peer Ready • ${hostIp || 'Local'}</span>
  </div>

  <div class="nav-tabs">
    <button class="tab-btn ${hasFile ? 'active' : ''}" id="tab-btn-download">⬇️ Receive from Laptop</button>
    <button class="tab-btn ${!hasFile ? 'active' : ''}" id="tab-btn-upload">⬆️ Send to Laptop</button>
  </div>

  <div class="card">
    <!-- Tab 1: Download Panel -->
    <div class="tab-panel ${hasFile ? 'active' : ''}" id="panel-download">
      ${hasFile ? `
        <div class="icon-wrapper">
          ${iconSvg}
        </div>
        <h1>${fileName}</h1>
        <div class="meta-pill">
          <span>${fileSizeFormatted}</span>
          <span class="dot">●</span>
          <span>${extLabel}</span>
        </div>
        <a href="/download" class="btn-action" id="dl-btn">
          <svg id="dl-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span id="dl-text">Download to Device</span>
        </a>
      ` : `
        <div class="icon-wrapper" style="opacity: 0.5;">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h1>No File Queued</h1>
        <p style="color: var(--text-secondary); font-size: 13px; margin: 12px 0 20px;">The laptop hasn't shared a specific download file yet. You can still send files to the laptop using the <strong>Send to Laptop</strong> tab above!</p>
      `}
    </div>

    <!-- Tab 2: Upload Panel -->
    <div class="tab-panel ${!hasFile ? 'active' : ''}" id="panel-upload">
      <input type="file" id="phone-file-input" multiple style="display:none">
      <div class="upload-zone" id="phone-drop-zone">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <div class="upload-title">Choose File or Photo</div>
        <div class="upload-subtitle">Saves straight to Laptop's Downloads</div>
      </div>

      <div class="selected-files-list" id="selected-files-list"></div>

      <button type="button" class="btn-action" id="upload-btn" disabled style="opacity: 0.5;">
        <span>Upload to Laptop</span>
      </button>

      <div class="progress-bar" id="upload-progress-bar">
        <div class="progress-fill" id="upload-progress-fill"></div>
      </div>
      <div class="upload-status" id="upload-status-text"></div>
    </div>
  </div>

  <div class="footer">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <span>Direct Local Transfer • Private & Cloud-Free</span>
  </div>

  <script>
    // Tab Switching
    const tabDl = document.getElementById('tab-btn-download');
    const tabUl = document.getElementById('tab-btn-upload');
    const panelDl = document.getElementById('panel-download');
    const panelUl = document.getElementById('panel-upload');

    tabDl.addEventListener('click', () => {
      tabDl.classList.add('active');
      tabUl.classList.remove('active');
      panelDl.classList.add('active');
      panelUl.classList.remove('active');
    });

    tabUl.addEventListener('click', () => {
      tabUl.classList.add('active');
      tabDl.classList.remove('active');
      panelUl.classList.add('active');
      panelDl.classList.remove('active');
    });

    // Download Animation
    const dlBtn = document.getElementById('dl-btn');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        const dlText = document.getElementById('dl-text');
        const dlIcon = document.getElementById('dl-icon');
        dlBtn.classList.add('success');
        dlText.textContent = 'Transfer Started…';
        dlIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        setTimeout(() => {
          dlBtn.classList.remove('success');
          dlText.textContent = 'Download Again';
          dlIcon.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';
        }, 3500);
      });
    }

    // Phone Upload Handler
    const phoneInput = document.getElementById('phone-file-input');
    const phoneDrop = document.getElementById('phone-drop-zone');
    const uploadBtn = document.getElementById('upload-btn');
    const fileListEl = document.getElementById('selected-files-list');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressFill = document.getElementById('upload-progress-fill');
    const statusText = document.getElementById('upload-status-text');

    phoneDrop.addEventListener('click', () => phoneInput.click());

    phoneInput.addEventListener('change', () => {
      if (phoneInput.files.length > 0) {
        uploadBtn.disabled = false;
        uploadBtn.style.opacity = '1';
        let html = '';
        for (let i = 0; i < phoneInput.files.length; i++) {
          const f = phoneInput.files[i];
          html += '<div>📄 ' + f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)</div>';
        }
        fileListEl.innerHTML = html;
        statusText.textContent = phoneInput.files.length + ' file(s) selected.';
      }
    });

    uploadBtn.addEventListener('click', () => {
      if (!phoneInput.files || phoneInput.files.length === 0) return;

      const formData = new FormData();
      for (let i = 0; i < phoneInput.files.length; i++) {
        formData.append('files', phoneInput.files[i]);
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Sending to Laptop…';
      progressBar.style.display = 'block';
      progressFill.style.width = '0%';
      statusText.textContent = 'Uploading over Wi-Fi…';

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          progressFill.style.width = pct + '%';
          statusText.textContent = 'Uploading: ' + pct + '%';
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          uploadBtn.textContent = '✔ Sent Successfully!';
          uploadBtn.classList.add('success');
          statusText.innerHTML = '🎉 <strong>Saved to Laptop Downloads!</strong>';
          phoneInput.value = '';
          fileListEl.innerHTML = '';
          setTimeout(() => {
            uploadBtn.textContent = 'Upload to Laptop';
            uploadBtn.classList.remove('success');
            uploadBtn.disabled = true;
            uploadBtn.style.opacity = '0.5';
            progressBar.style.display = 'none';
          }, 4000);
        } else {
          statusText.textContent = '❌ Upload failed: ' + xhr.statusText;
          uploadBtn.disabled = false;
          uploadBtn.textContent = 'Retry Upload';
        }
      };

      xhr.onerror = () => {
        statusText.textContent = '❌ Network connection error.';
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Retry Upload';
      };

      xhr.send(formData);
    });
  </script>
</body>
</html>`;
}

/**
 * Render sleek desktop Web Hub for laptop browser
 */
export function renderWebHubPage({ hostIp, port, shareUrl, currentShare }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickShare-QR • Web Hub</title>
  <style>
    :root {
      --bg-dark: #090d16;
      --card-bg: rgba(15, 23, 42, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --accent: #38bdf8;
      --accent-hover: #0ea5e9;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --success: #10b981;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: radial-gradient(circle at 50% 0%, #172554 0%, var(--bg-dark) 75%);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 24px;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      width: 100%;
    }

    /* Navbar */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 28px;
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-badge {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);
    }

    .logo-title {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .logo-sub {
      font-size: 12px;
      color: var(--text-muted);
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 999px;
      font-size: 12px;
      color: #6ee7b7;
      font-weight: 500;
    }

    .pulse {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    /* Grid Layout */
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
    }

    .panel {
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.5);
    }

    .panel-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .panel-desc {
      font-size: 12.5px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }

    /* Drop Zone */
    .dropzone {
      border: 2px dashed rgba(56, 189, 248, 0.35);
      background: rgba(0, 0, 0, 0.25);
      border-radius: 16px;
      padding: 28px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 20px;
    }

    .dropzone:hover, .dropzone.drag-active {
      border-color: var(--accent);
      background: rgba(56, 189, 248, 0.08);
    }

    .dropzone svg {
      color: var(--accent);
      margin-bottom: 12px;
    }

    .drop-btn-row {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 14px;
    }

    .btn-sm {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--card-border);
      color: var(--text-main);
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-sm:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.25);
    }

    /* Active Share Card */
    .share-details {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .file-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(56, 189, 248, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
      flex-shrink: 0;
    }

    .file-name-text {
      font-size: 14px;
      font-weight: 600;
      word-break: break-all;
      color: #fff;
    }

    .file-meta-text {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* QR Code Display */
    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 18px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 16px;
      border: 1px solid var(--card-border);
      text-align: center;
    }

    .qr-svg-wrapper {
      background: #ffffff;
      padding: 12px;
      border-radius: 12px;
      width: 190px;
      height: 190px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .qr-svg-wrapper svg {
      width: 100%;
      height: 100%;
    }

    .qr-url-row {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      padding: 6px 12px;
      border-radius: 8px;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      color: var(--accent);
      max-width: 100%;
      word-break: break-all;
    }

    .btn-copy {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 13px;
      transition: color 0.2s;
    }

    .btn-copy:hover {
      color: #fff;
    }

    /* Activity Feed */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 380px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      font-size: 13px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .activity-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }

    .badge-download {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
    }

    .badge-upload {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--accent);
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 13px;
      color: #fff;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      display: none;
      z-index: 1000;
    }

    @media (max-width: 768px) {
      body {
        padding: 16px 12px;
      }
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 20px;
        padding-bottom: 16px;
      }
      .status-pill {
        align-self: flex-start;
        font-size: 11.5px;
        padding: 4px 10px;
      }
      .grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .panel {
        padding: 18px 14px;
        border-radius: 16px;
      }
      .dropzone {
        padding: 20px 12px;
      }
      .drop-btn-row {
        flex-direction: column;
        width: 100%;
      }
      .btn-sm {
        width: 100%;
        padding: 8px 14px;
        font-size: 13px;
      }
      .qr-svg-wrapper {
        width: 160px;
        height: 160px;
      }
      .qr-url-row {
        font-size: 11px;
        padding: 6px 10px;
        width: 100%;
        justify-content: space-between;
      }
      .toast {
        right: 14px;
        left: 14px;
        bottom: 16px;
        text-align: center;
      }
    }

    @media (max-width: 400px) {
      .logo-title {
        font-size: 17px;
      }
      .logo-sub {
        font-size: 11px;
      }
      .qr-svg-wrapper {
        width: 140px;
        height: 140px;
        padding: 8px;
      }
      .panel-title {
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="logo-group">
        <div class="logo-badge">⚡</div>
        <div>
          <div class="logo-title">QuickShare-QR Web Hub</div>
          <div class="logo-sub">High-Speed Local Wi-Fi Transfer between Laptop & Mobile</div>
        </div>
      </div>
      <div class="status-pill">
        <span class="pulse"></span>
        <span id="hub-ip-badge">http://${hostIp}:${port}</span>
      </div>
    </header>

    <main class="grid">
      <!-- Left Panel: Share to Phone -->
      <section class="panel">
        <h2 class="panel-title">📤 Share from Laptop to Phone</h2>
        <p class="panel-desc">Drag and drop any file or folder to generate an instant QR code.</p>

        <input type="file" id="hub-file-input" style="display:none">
        <input type="file" id="hub-folder-input" webkitdirectory directory style="display:none">

        <div class="dropzone" id="hub-dropzone">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div style="font-weight:600; font-size:14px; margin-bottom:4px;">Drop file or folder here to share</div>
          <div style="font-size:12px; color:var(--text-muted)">or select directly from your computer</div>
          <div class="drop-btn-row">
            <button type="button" class="btn-sm" id="btn-select-file">📄 Select File</button>
            <button type="button" class="btn-sm" id="btn-select-folder">📁 Select Folder</button>
          </div>
        </div>

        <div class="share-details" id="hub-share-details" style="${currentShare?.fileName ? '' : 'display:none;'}">
          <div class="file-icon-box" id="hub-file-icon">📦</div>
          <div>
            <div class="file-name-text" id="hub-file-name">${currentShare?.fileName || 'No file selected'}</div>
            <div class="file-meta-text" id="hub-file-meta">${currentShare?.fileSizeFormatted || ''}</div>
          </div>
        </div>

        <div class="qr-container">
          <div class="qr-svg-wrapper" id="hub-qr-wrapper">
            <!-- QR SVG injected dynamically -->
            <div style="color:#0f172a; font-size:12px; text-align:center;">Loading QR Code...</div>
          </div>
          <div class="qr-url-row">
            <span id="hub-qr-url">${shareUrl}</span>
            <button type="button" class="btn-copy" id="hub-btn-copy" title="Copy URL">📋</button>
          </div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:8px;">
            📱 Point your smartphone camera at the code to connect
          </div>
        </div>
      </section>

      <!-- Right Panel: Received Files from Phone -->
      <section class="panel">
        <h2 class="panel-title">📥 Receive from Phone to Laptop</h2>
        <p class="panel-desc">Files uploaded by phones over Wi-Fi land directly in your <code>Downloads</code> folder.</p>

        <div style="background: rgba(0,0,0,0.3); padding: 12px 16px; border-radius: 12px; border: 1px solid var(--card-border); margin-bottom: 20px; font-size: 13px;">
          <span style="color: var(--text-muted);">Destination Folder:</span>
          <span style="color: #38bdf8; font-family: ui-monospace, monospace; margin-left: 6px;">~/Downloads</span>
        </div>

        <h3 style="font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Live Wi-Fi Activity Feed</h3>

        <div class="activity-list" id="hub-activity-list">
          <div class="empty-state" id="hub-empty-state">
            <div style="font-size: 24px; margin-bottom: 8px;">📶</div>
            Waiting for mobile connections...<br>
            <span style="font-size: 12px; opacity: 0.7;">Downloads and uploads will appear here in real-time.</span>
          </div>
        </div>
      </section>
    </main>
  </div>

  <div class="toast" id="hub-toast"></div>

  <script>
    const shareUrl = '${shareUrl}';
    const qrWrapper = document.getElementById('hub-qr-wrapper');
    const qrUrlText = document.getElementById('hub-qr-url');
    const toast = document.getElementById('hub-toast');

    function showToast(msg) {
      toast.textContent = msg;
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3500);
    }

    // Load QR SVG
    async function loadQrCode(targetUrl) {
      try {
        const res = await fetch('/api/qr?url=' + encodeURIComponent(targetUrl));
        const svg = await res.text();
        qrWrapper.innerHTML = svg;
      } catch (err) {
        qrWrapper.innerHTML = '<div style="color:red;font-size:12px;">QR load failed</div>';
      }
    }
    loadQrCode(shareUrl);

    // Copy URL with visual button feedback
    const copyBtn = document.getElementById('hub-btn-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('📋 Direct URL copied to clipboard!');
          const origText = copyBtn.innerHTML;
          copyBtn.innerHTML = '✔ Copied!';
          copyBtn.style.color = '#38bdf8';
          setTimeout(() => {
            copyBtn.innerHTML = origText;
            copyBtn.style.color = '';
          }, 2000);
        });
      });
    }

    // Dismiss toast on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toast.style.display !== 'none') {
        toast.style.display = 'none';
      }
    });

    // File selection
    const fileInput = document.getElementById('hub-file-input');
    const folderInput = document.getElementById('hub-folder-input');
    const dropzone = document.getElementById('hub-dropzone');

    document.getElementById('btn-select-file').addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    document.getElementById('btn-select-folder').addEventListener('click', (e) => {
      e.stopPropagation();
      folderInput.click();
    });

    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFileToShare(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        uploadFileToShare(fileInput.files[0]);
      }
    });

    async function uploadFileToShare(file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/set-share', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          document.getElementById('hub-share-details').style.display = 'flex';
          document.getElementById('hub-file-name').textContent = data.fileName;
          document.getElementById('hub-file-meta').textContent = data.fileSizeFormatted;
          showToast('✅ Ready to share: ' + data.fileName);
          addActivity('share', 'Set file to share: ' + data.fileName);
        }
      } catch (err) {
        showToast('❌ Failed to set share file: ' + err.message);
      }
    }

    function addActivity(type, text) {
      const empty = document.getElementById('hub-empty-state');
      if (empty) empty.style.display = 'none';

      const list = document.getElementById('hub-activity-list');
      const item = document.createElement('div');
      item.className = 'activity-item';
      const badgeClass = type === 'upload' ? 'badge-upload' : 'badge-download';
      const badgeText = type === 'upload' ? 'PHONE ➔ PC' : 'PC ➔ PHONE';

      item.innerHTML = '<div>' + text + '</div><span class="activity-badge ' + badgeClass + '">' + badgeText + '</span>';
      list.prepend(item);
    }

    // Connect to Server-Sent Events (SSE) for live peer activity
    try {
      const evtSource = new EventSource('/api/events');
      evtSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'download_complete') {
            addActivity('download', 'Phone downloaded: ' + data.fileName);
            showToast('📱 Download complete: ' + data.fileName);
          } else if (data.type === 'upload_complete') {
            addActivity('upload', 'Received from phone: ' + data.fileName + ' (' + data.sizeFormatted + ')');
            showToast('📥 Received file: ' + data.fileName);
          }
        } catch {}
      };
    } catch {}
  </script>
</body>
</html>`;
}
