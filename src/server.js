import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import chalk from 'chalk';
import busboy from 'busboy';
import QRCode from 'qrcode';
import { ZipArchive } from 'archiver';
import { renderDownloadPage, renderWebHubPage } from './templates.js';
import { formatBytes } from './ui.js';
import { getLocalIpAddress } from './network.js';

/**
 * Encodes Content-Disposition according to RFC 5987 / RFC 6266
 * Supports Unicode/UTF-8 filenames across modern and legacy mobile browsers
 */
export function buildContentDisposition(fileName) {
  const asciiFallback = fileName.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '');
  const encoded = encodeURIComponent(fileName);
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encoded}`;
}

/**
 * Creates a unique file path if candidate already exists
 */
export function getUniqueFilePath(dir, originalName) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  let candidate = path.join(dir, originalName);
  let counter = 1;

  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `${base} (${counter})${ext}`);
    counter++;
  }

  return candidate;
}

/**
 * Creates and starts local HTTP transfer server
 */
export function createSharingServer({
  filePath = null,
  port = 3003,
  once = false,
  uploadDir = path.join(os.homedir(), 'Downloads'),
  onReady = null
}) {
  let currentShare = null;

  if (filePath) {
    const absolutePath = path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
      const stat = fs.statSync(absolutePath);
      const isDirectory = stat.isDirectory();
      const fileName = path.basename(absolutePath);
      const ext = isDirectory ? 'zip' : (path.extname(fileName).replace('.', '') || 'bin');
      const fileSize = isDirectory ? 0 : stat.size;
      const fileSizeFormatted = isDirectory ? 'Directory (Auto-Zip)' : formatBytes(stat.size);

      currentShare = {
        filePath: absolutePath,
        fileName,
        extension: ext,
        isDirectory,
        fileSize,
        fileSizeFormatted
      };
    }
  }

  const sseClients = new Set();

  function broadcastEvent(eventData) {
    const payload = `data: ${JSON.stringify(eventData)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch {
        sseClients.delete(client);
      }
    }
  }

  const server = http.createServer(async (req, res) => {
    const hostHeader = req.headers.host || `localhost:${port}`;
    const url = new URL(req.url, `http://${hostHeader}`);
    const pathname = url.pathname;

    const isLocalClient = req.socket.remoteAddress === '127.0.0.1' ||
                          req.socket.remoteAddress === '::1' ||
                          req.socket.remoteAddress === '::ffff:127.0.0.1' ||
                          req.headers.host?.startsWith('localhost') ||
                          req.headers.host?.startsWith('127.0.0.1');

    // 1. Landing Page / Web Hub
    if (pathname === '/' || pathname === '/hub') {
      const hostIp = getLocalIpAddress();
      const actualPort = server.address() ? server.address().port : port;
      const shareUrl = `http://${hostIp}:${actualPort}`;

      // Show Web Hub if explicitly visiting /hub or if running in Web Hub mode (no file queued)
      if (pathname === '/hub' || !currentShare?.filePath) {
        const html = renderWebHubPage({
          hostIp,
          port: actualPort,
          shareUrl,
          currentShare
        });
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': Buffer.byteLength(html)
        });
        res.end(html);
        return;
      }

      // Mobile Landing Page
      const html = renderDownloadPage({
        fileName: currentShare ? currentShare.fileName : null,
        fileSizeFormatted: currentShare ? currentShare.fileSizeFormatted : '',
        extension: currentShare ? currentShare.extension : 'bin',
        isDirectory: currentShare ? currentShare.isDirectory : false,
        hostIp,
        port: actualPort
      });

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(html)
      });
      res.end(html);
      return;
    }

    // 2. Direct File / Directory Download Stream (GET /download)
    if (pathname === '/download') {
      if (!currentShare || !currentShare.filePath || !fs.existsSync(currentShare.filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('No file or directory currently queued for download.');
        return;
      }

      const clientIp = req.socket.remoteAddress || 'unknown';
      console.log(`\n  ${chalk.cyan('⚡ Incoming download request from:')} ${chalk.gray(clientIp)}`);

      // Directory auto-zip stream
      if (currentShare.isDirectory) {
        const zipFileName = `${currentShare.fileName}.zip`;
        res.writeHead(200, {
          'Content-Type': 'application/zip',
          'Content-Disposition': buildContentDisposition(zipFileName)
        });

        const zip = new ZipArchive();
        zip.pipe(res);

        res.on('close', () => {
          if (!res.writableEnded) {
            zip.destroy();
          }
        });

        res.on('finish', () => {
          console.log(`  ${chalk.green('✔ Directory archive download complete:')} ${chalk.white(zipFileName)}`);
          broadcastEvent({ type: 'download_complete', fileName: zipFileName });
          if (once) {
            console.log(chalk.gray('  Single-use mode active (--once). Shutting down server...'));
            server.close(() => process.exit(0));
          }
        });

        zip.directory(currentShare.filePath, false);
        zip.finalize();
        return;
      }

      // Single file stream
      const stat = fs.statSync(currentShare.filePath);
      res.writeHead(200, {
        'Content-Disposition': buildContentDisposition(currentShare.fileName),
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size
      });

      const fileStream = fs.createReadStream(currentShare.filePath);
      fileStream.pipe(res);

      res.on('finish', () => {
        console.log(`  ${chalk.green('✔ Download complete:')} ${chalk.white(currentShare.fileName)}`);
        broadcastEvent({ type: 'download_complete', fileName: currentShare.fileName });
        if (once) {
          console.log(chalk.gray('  Single-use mode active (--once). Shutting down server...'));
          server.close(() => process.exit(0));
        }
      });

      res.on('close', () => {
        if (!res.writableEnded) {
          fileStream.destroy();
        }
      });

      fileStream.on('error', (err) => {
        console.error(chalk.red(`  File stream error: ${err.message}`));
        res.destroy();
      });
      return;
    }

    // 3. API: Generate SVG QR Code (GET /api/qr)
    if (pathname === '/api/qr') {
      const hostIp = getLocalIpAddress();
      const actualPort = server.address() ? server.address().port : port;
      const targetUrl = url.searchParams.get('url') || `http://${hostIp}:${actualPort}`;

      try {
        const svg = await QRCode.toString(targetUrl, { type: 'svg', margin: 1 });
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.end(svg);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Failed to generate QR code: ' + err.message);
      }
      return;
    }

    // 4. API: Server-Sent Events (GET /api/events)
    if (pathname === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write(': connected\n\n');
      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    // 5. API: Upload File from Phone to Laptop (POST /api/upload)
    if (req.method === 'POST' && pathname === '/api/upload') {
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const bb = busboy({ headers: req.headers });
        const savedFiles = [];
        const filePromises = [];

        bb.on('file', (name, fileStream, info) => {
          const { filename } = info;
          const safeName = path.basename(filename).replace(/[^\w\.\-\s\(\)\[\]]/g, '_') || `upload-${Date.now()}`;
          const targetPath = getUniqueFilePath(uploadDir, safeName);
          const writeStream = fs.createWriteStream(targetPath);

          let bytesWritten = 0;
          fileStream.on('data', chunk => { bytesWritten += chunk.length; });
          fileStream.pipe(writeStream);

          const finishPromise = new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
              const sizeFormatted = formatBytes(bytesWritten);
              console.log(`\n  ${chalk.green('📥 Received file from mobile phone:')} ${chalk.bold.white(path.basename(targetPath))} (${chalk.cyan(sizeFormatted)})`);
              console.log(`  ${chalk.gray('Saved to:')} ${chalk.underline(targetPath)}`);

              const fileRecord = {
                fileName: path.basename(targetPath),
                size: bytesWritten,
                sizeFormatted,
                savedPath: targetPath
              };
              savedFiles.push(fileRecord);
              broadcastEvent({ type: 'upload_complete', ...fileRecord });
              resolve();
            });
            writeStream.on('error', reject);
            fileStream.on('error', reject);
          });

          filePromises.push(finishPromise);
        });

        bb.on('close', async () => {
          try {
            await Promise.all(filePromises);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, files: savedFiles }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });

        bb.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });

        req.pipe(bb);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 6. API: Set File to Share from Web Hub (POST /api/set-share)
    if (req.method === 'POST' && pathname === '/api/set-share') {
      try {
        const tempDir = path.join(os.tmpdir(), 'quickshare-uploads');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        const bb = busboy({ headers: req.headers });
        const filePromises = [];

        bb.on('file', (name, fileStream, info) => {
          const { filename } = info;
          const safeName = path.basename(filename).replace(/[^\w\.\-\s\(\)\[\]]/g, '_') || `share-${Date.now()}`;
          const targetPath = path.join(tempDir, safeName);
          const writeStream = fs.createWriteStream(targetPath);

          let bytesWritten = 0;
          fileStream.on('data', chunk => { bytesWritten += chunk.length; });
          fileStream.pipe(writeStream);

          const finishPromise = new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
              const ext = path.extname(safeName).replace('.', '') || 'bin';
              const sizeFormatted = formatBytes(bytesWritten);

              currentShare = {
                filePath: targetPath,
                fileName: safeName,
                extension: ext,
                isDirectory: false,
                fileSize: bytesWritten,
                fileSizeFormatted: sizeFormatted
              };

              console.log(`\n  ${chalk.cyan('🔄 Shared file updated via Web Hub:')} ${chalk.bold.white(safeName)} (${chalk.green(sizeFormatted)})`);
              broadcastEvent({ type: 'share_updated', ...currentShare });
              resolve();
            });
            writeStream.on('error', reject);
            fileStream.on('error', reject);
          });

          filePromises.push(finishPromise);
        });

        bb.on('close', async () => {
          try {
            await Promise.all(filePromises);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, ...currentShare }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });

        bb.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message }));
        });

        req.pipe(bb);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return;
    }

    // 7. API: Get Server Status (GET /api/status)
    if (pathname === '/api/status') {
      const hostIp = getLocalIpAddress();
      const actualPort = server.address() ? server.address().port : port;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        hostIp,
        port: actualPort,
        shareUrl: `http://${hostIp}:${actualPort}`,
        currentShare
      }));
      return;
    }

    // 8. 404
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  });

  return new Promise((resolve, reject) => {
    let currentPort = port;
    let retries = 0;
    const maxRetries = 10;

    function listen() {
      server.listen(currentPort, '0.0.0.0');
    }

    server.once('listening', () => {
      const actualPort = server.address().port;
      const hostIp = getLocalIpAddress();
      const shareUrl = `http://${hostIp}:${actualPort}`;

      if (onReady) {
        onReady({
          url: shareUrl,
          port: actualPort,
          hostIp,
          fileName: currentShare?.fileName || 'Web Hub Mode',
          fileSize: currentShare?.fileSize || 0,
          isDirectory: currentShare?.isDirectory || false
        });
      }

      resolve({ server, shareUrl, actualPort, hostIp, currentShare });
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && currentPort !== 0 && retries < maxRetries) {
        retries++;
        currentPort++;
        listen();
      } else {
        reject(err);
      }
    });

    listen();
  });
}
