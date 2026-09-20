import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { renderDownloadPage } from './templates.js';
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
 * Creates and starts local HTTP transfer server
 */
export function createSharingServer({ filePath, port = 3000, once = false, onReady = null }) {
  const absolutePath = path.resolve(filePath);
  const fileName = path.basename(absolutePath);
  const ext = path.extname(fileName).replace('.', '') || 'bin';
  const stat = fs.statSync(absolutePath);
  const fileSizeFormatted = formatBytes(stat.size);

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    // 1. Landing Page
    if (url.pathname === '/') {
      const html = renderDownloadPage({
        fileName,
        fileSizeFormatted,
        extension: ext
      });
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(html)
      });
      res.end(html);
      return;
    }

    // 2. Direct File Download Stream
    if (url.pathname === '/download') {
      res.writeHead(200, {
        'Content-Disposition': buildContentDisposition(fileName),
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size
      });

      console.log(`\n  ${chalk.cyan('⚡ Incoming download request from:')} ${chalk.gray(req.socket.remoteAddress)}`);

      const fileStream = fs.createReadStream(absolutePath);
      fileStream.pipe(res);

      res.on('finish', () => {
        console.log(`  ${chalk.green('✔ Download complete:')} ${chalk.white(fileName)}`);
        if (once) {
          console.log(chalk.gray('  Single-use mode active (--once). Shutting down server...'));
          server.close(() => process.exit(0));
        }
      });

      // Cleanup stream immediately if client disconnects early
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

    // 3. 404 for unknown paths
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
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
          fileName,
          fileSize: stat.size
        });
      }

      resolve({ server, shareUrl, actualPort, hostIp });
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
