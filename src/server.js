import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { renderDownloadPage } from './templates.js';
import { formatBytes } from './ui.js';
import { getLocalIpAddress } from './network.js';

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
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
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
    server.listen(port, '0.0.0.0', () => {
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
      reject(err);
    });
  });
}
