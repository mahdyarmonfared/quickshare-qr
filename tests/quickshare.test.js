import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { getLocalIpAddress } from '../src/network.js';
import { formatBytes } from '../src/ui.js';
import { createSharingServer } from '../src/server.js';

test('getLocalIpAddress returns valid IPv4 address', () => {
  const ip = getLocalIpAddress();
  assert.match(ip, /^(?:\d{1,3}\.){3}\d{1,3}$/);
});

test('formatBytes handles multiple size tiers', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
  assert.equal(formatBytes(1073741824), '1 GB');
});

test('QuickShare server full lifecycle: landing page and download stream', async (t) => {
  const tempFile = path.join(os.tmpdir(), `quickshare-test-${Date.now()}.txt`);
  const fileContent = 'Hello from QuickShare-QR local transfer test!';
  await fs.writeFile(tempFile, fileContent, 'utf8');

  let serverInstance = null;

  try {
    // Start server on port 0 (auto-allocated available port)
    const { server, actualPort } = await createSharingServer({
      filePath: tempFile,
      port: 0
    });
    serverInstance = server;

    // Helper to perform HTTP GET
    const makeRequest = (requestPath) => {
      return new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${actualPort}${requestPath}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ res, data }));
        }).on('error', reject);
      });
    };

    // 1. Test Landing Page (GET /)
    const landing = await makeRequest('/');
    assert.equal(landing.res.statusCode, 200);
    assert.match(landing.res.headers['content-type'], /text\/html/);
    assert.ok(landing.data.includes(path.basename(tempFile)));
    assert.ok(landing.data.includes('Download to Device'));

    // 2. Test Direct Download Stream (GET /download)
    const download = await makeRequest('/download');
    assert.equal(download.res.statusCode, 200);
    assert.equal(download.res.headers['content-type'], 'application/octet-stream');
    assert.ok(download.res.headers['content-disposition'].includes('attachment'));
    assert.equal(download.data, fileContent);

    // 3. Test 404
    const notFound = await makeRequest('/random-path');
    assert.equal(notFound.res.statusCode, 404);
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
    await fs.unlink(tempFile).catch(() => {});
  }
});
