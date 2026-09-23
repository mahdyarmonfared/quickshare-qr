import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { getLocalIpAddress } from '../src/network.js';
import { formatBytes } from '../src/ui.js';
import { createSharingServer, buildContentDisposition } from '../src/server.js';

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

test('buildContentDisposition adheres to RFC 5987 / RFC 6266', () => {
  const resultAscii = buildContentDisposition('simple.txt');
  assert.equal(resultAscii, `attachment; filename="simple.txt"; filename*=UTF-8''simple.txt`);

  const resultUnicode = buildContentDisposition('گزارش نهایی.pdf');
  assert.ok(resultUnicode.includes('filename*=UTF-8\'\'%DA%AF%D8%B2%D8%A7%D8%B1%D8%B4%20%D9%86%D9%87%D8%A7%DB%8C%DB%8C.pdf'));
});

test('QuickShare server automatically increments port on EADDRINUSE', async () => {
  const tempFile = path.join(os.tmpdir(), `quickshare-port-test-${Date.now()}.txt`);
  await fs.writeFile(tempFile, 'test port collision', 'utf8');

  // Start a dummy blocker server on a known port
  const blocker = http.createServer((req, res) => res.end('occupied'));
  await new Promise((resolve) => blocker.listen(0, '0.0.0.0', resolve));
  const occupiedPort = blocker.address().port;

  let secondaryServer = null;
  try {
    // Attempt to start QuickShare on occupiedPort
    const { server, actualPort } = await createSharingServer({
      filePath: tempFile,
      port: occupiedPort
    });
    secondaryServer = server;

    assert.equal(actualPort, occupiedPort + 1, 'Server should have retried and bound to next available port');
  } finally {
    blocker.close();
    if (secondaryServer) {
      secondaryServer.close();
    }
    await fs.unlink(tempFile).catch(() => {});
  }
});

test('QuickShare server directory streaming zip archive', async () => {
  const tempDir = path.join(os.tmpdir(), `quickshare-dir-test-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'content 1', 'utf8');
  await fs.writeFile(path.join(tempDir, 'file2.txt'), 'content 2', 'utf8');

  let serverInstance = null;
  try {
    const { server, actualPort } = await createSharingServer({
      filePath: tempDir,
      port: 0
    });
    serverInstance = server;

    const res = await fetch(`http://127.0.0.1:${actualPort}/download`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'application/zip');
    const disposition = res.headers.get('content-disposition');
    assert.ok(disposition.includes(path.basename(tempDir) + '.zip'));

    const arrayBuf = await res.arrayBuffer();
    assert.ok(arrayBuf.byteLength > 0, 'Zip buffer should not be empty');
  } finally {
    if (serverInstance) serverInstance.close();
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
});

test('QuickShare bi-directional phone-to-laptop upload endpoint', async () => {
  const uploadDir = path.join(os.tmpdir(), `quickshare-uploads-${Date.now()}`);
  await fs.mkdir(uploadDir, { recursive: true });

  let serverInstance = null;
  try {
    const { server, actualPort } = await createSharingServer({
      port: 0,
      uploadDir
    });
    serverInstance = server;

    const formData = new FormData();
    formData.append('file', new Blob(['sample phone photo bytes']), 'phone-photo.jpg');

    const res = await fetch(`http://127.0.0.1:${actualPort}/api/upload`, {
      method: 'POST',
      body: formData
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.files.length, 1);
    assert.equal(body.files[0].fileName, 'phone-photo.jpg');

    const savedContent = await fs.readFile(path.join(uploadDir, 'phone-photo.jpg'), 'utf8');
    assert.equal(savedContent, 'sample phone photo bytes');
  } finally {
    if (serverInstance) serverInstance.close();
    await fs.rm(uploadDir, { recursive: true, force: true }).catch(() => {});
  }
});

test('QuickShare SVG QR code generation endpoint', async () => {
  let serverInstance = null;
  try {
    const { server, actualPort } = await createSharingServer({ port: 0 });
    serverInstance = server;

    const res = await fetch(`http://127.0.0.1:${actualPort}/api/qr?url=http://example.com/test`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'image/svg+xml');
    const svg = await res.text();
    assert.ok(svg.startsWith('<svg'), 'Response must be valid SVG');
  } finally {
    if (serverInstance) serverInstance.close();
  }
});

test('QuickShare Web Hub mode renders dashboard when no file is passed', async () => {
  let serverInstance = null;
  try {
    const { server, actualPort } = await createSharingServer({ port: 0 });
    serverInstance = server;

    const res = await fetch(`http://127.0.0.1:${actualPort}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    const html = await res.text();
    assert.ok(html.includes('QuickShare-QR Web Hub'));
    assert.ok(html.includes('Share from Laptop to Phone'));
    assert.ok(html.includes('Receive from Phone to Laptop'));
  } finally {
    if (serverInstance) serverInstance.close();
  }
});


