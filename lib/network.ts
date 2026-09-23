import os from "node:os";

/**
 * Best-effort detection of this machine's real LAN IPv4 address, for the
 * Settings "Remote Access" QR panel (ticket 13). `os.networkInterfaces()`
 * returns every adapter Windows/macOS/Linux happens to have configured —
 * VPN tunnels (ProtonVPN, WireGuard, Tailscale...), WSL/Hyper-V virtual
 * switches, and loopback all show up alongside the real Wi-Fi/Ethernet
 * adapter a phone could actually reach. Picking the wrong one produces a
 * QR code that looks fine but silently fails to load on the phone, so this
 * filters out the common non-LAN cases rather than just grabbing the first
 * non-internal IPv4 found.
 */

const EXCLUDE_NAME_PATTERN =
  /vethernet|virtual|wsl|hyper-v|vpn|tailscale|zerotier|docker|loopback|utun|tun\d|tap\d/i;

export interface LanIpResult {
  address: string | null;
  interfaceName: string | null;
}

export function getLanIp(): LanIpResult {
  const interfaces = os.networkInterfaces();
  const candidates: { name: string; address: string; netmask: string }[] = [];

  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    for (const addr of addrs) {
      if (addr.family !== "IPv4" || addr.internal) continue;
      // A /32 (255.255.255.255) netmask is the classic signature of a
      // point-to-point VPN tunnel adapter, not a real LAN segment.
      if (addr.netmask === "255.255.255.255") continue;
      if (EXCLUDE_NAME_PATTERN.test(name)) continue;
      candidates.push({ name, address: addr.address, netmask: addr.netmask });
    }
  }

  if (candidates.length === 0) return { address: null, interfaceName: null };

  // Prefer the most common home/office LAN ranges in order; 192.168.x.x is
  // by far the most typical consumer router default.
  const rank = (address: string): number => {
    if (address.startsWith("192.168.")) return 0;
    if (/^10\./.test(address)) return 1;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(address)) return 2;
    return 3;
  };

  candidates.sort((a, b) => rank(a.address) - rank(b.address));
  return { address: candidates[0].address, interfaceName: candidates[0].name };
}
