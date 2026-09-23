import os from 'node:os';

/**
 * Automatically discovers the non-internal IPv4 address of the host machine
 * Prioritizes physical LAN/Wi-Fi adapters over virtual/VPN adapters (docker, tun, tap, veth)
 * @returns {string} Local IPv4 address (e.g. 192.168.1.15) or 127.0.0.1
 */
export function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(interfaces)) {
    const isVirtualOrVpn = /^(tun|tap|docker|br-|veth|vboxnet|vmnet)/i.test(name);

    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        candidates.push({
          name,
          address: net.address,
          isVirtualOrVpn,
          isLanPriority: /^(wl|en|eth|wlan|wi-fi|ethernet)/i.test(name)
        });
      }
    }
  }

  // 1. Prefer physical LAN/Wi-Fi adapter
  const lanMatch = candidates.find(c => c.isLanPriority && !c.isVirtualOrVpn);
  if (lanMatch) return lanMatch.address;

  // 2. Next prefer any non-virtual IPv4
  const physicalMatch = candidates.find(c => !c.isVirtualOrVpn);
  if (physicalMatch) return physicalMatch.address;

  // 3. Fallback to any candidate
  if (candidates.length > 0) return candidates[0].address;

  return '127.0.0.1';
}
