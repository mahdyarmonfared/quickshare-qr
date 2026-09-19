import os from 'node:os';

/**
 * Automatically discovers the non-internal IPv4 address of the host machine
 * @returns {string} Local IPv4 address (e.g. 192.168.1.15) or 127.0.0.1
 */
export function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Skip over internal (e.g. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return '127.0.0.1';
}
