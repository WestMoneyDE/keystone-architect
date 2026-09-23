# Remote Access

Keystone runs on your own machine — there's no cloud server involved. The
Settings → "Fernzugriff" panel gives you a QR code that works great when your
phone is on the **same Wi-Fi network** as the computer running Keystone. This
page covers the two supported options for reaching Keystone from **outside**
that local network (e.g. from a different Wi-Fi, mobile data, or while
travelling), without Keystone having to build or operate any tunneling/relay
infrastructure of its own.

Both options below are free for personal use, require no port-forwarding on
your router, and don't require you to open your machine to the public
internet — except Cloudflare Tunnel's optional public-URL mode, which is
called out explicitly below because it changes Keystone's security posture.

---

## Option 1: Tailscale (recommended)

[Tailscale](https://tailscale.com) creates a private mesh VPN between your
own devices ("tailnet") using WireGuard. Only devices you've logged into with
your account can reach each other — nothing is exposed publicly. This is the
best default for "access Keystone from my phone when I'm not home."

### Setup

1. **On the computer running Keystone:**
   - Go to [tailscale.com/download](https://tailscale.com/download) and
     install the Windows/macOS/Linux client for your OS.
   - Launch it, click the Tailscale tray/menu-bar icon, choose **Log in**,
     and sign in with Google, Microsoft, GitHub, or Apple (a personal Gmail
     address gets you the free Personal plan — 6 users, plenty for this).
   - Once logged in, Tailscale assigns this machine a stable private IP,
     typically in the `100.x.y.z` range (view it any time via the tray icon
     or `tailscale ip -4` in a terminal).

2. **On your phone (or any other remote device):**
   - Install the **Tailscale** app from the App Store or Google Play.
   - Sign in with the **same account** you used on the computer.

3. **Access Keystone:**
   - With both devices signed into the same tailnet, open
     `http://<tailscale-ip>:3000` (or whatever port Keystone is running on)
     on your phone's browser — this works from any network the phone has
     internet access on, not just your home Wi-Fi.
   - For convenience, add the page to your phone's home screen (Keystone is
     an installable PWA — see Settings for the install prompt) so it behaves
     like a native app.

4. **Security note:** turn on multi-factor authentication with whichever
   identity provider you signed in with (Google/Microsoft/GitHub/Apple) —
   Tailscale's access control is only as strong as that account.

No ports are opened on your router, and no traffic ever touches the public
internet in plaintext — Tailscale's docs have the full technical picture if
you want it: [tailscale.com/docs/how-to/quickstart](https://tailscale.com/docs/how-to/quickstart).

---

## Option 2: Cloudflare Tunnel (public HTTPS URL)

Use this if you specifically want a **public URL** you can share (e.g. with
someone who doesn't have Tailscale installed), or want a stable custom
subdomain rather than a private mesh address.

### ⚠️ Important security caveat — read before using this option

Keystone's v1 has **no login/authentication layer** — it's designed as a
single-user, self-hosted app protected by the fact that only people on your
own network (or your own Tailscale tailnet) can reach it. **A Cloudflare
Tunnel changes that**: anyone who has (or guesses, or finds indexed) the
public URL can open your Keystone instance, read your notes/highlights,
your conversations with your configured LLM provider, and your test
attempts/certificates. There is no password prompt in front of any of it.

Only use this option if you understand and accept that exposure. If you do,
prefer the **quick/temporary tunnel** below for short-lived access (it
generates a random, hard-to-guess URL and is easy to tear down) over a
permanent named tunnel with a memorable subdomain. Do not link the resulting
URL from anywhere public (no social bios, no indexed pages).

### Setup — quick tunnel (no Cloudflare account required)

1. Install `cloudflared`:
   - **Windows:** `winget install --id Cloudflare.cloudflared`
   - **macOS:** `brew install cloudflared`
   - **Linux:** see
     [pkg.cloudflare.com](https://pkg.cloudflare.com/index.html) for your
     distro's package, or download the binary directly from
     [github.com/cloudflare/cloudflared/releases](https://github.com/cloudflare/cloudflared/releases).

2. With Keystone running (`npm run dev` / the desktop app / `docker compose
   up`), start a tunnel pointed at its port:

   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. `cloudflared` prints a random public HTTPS URL, e.g.
   `https://seasonal-deck-organisms-sf.trycloudflare.com`. Anyone with this
   URL can reach your Keystone instance immediately — treat it accordingly
   (see caveat above). Closing the terminal / stopping `cloudflared` tears
   the tunnel down.

   Note: quick tunnels are meant for casual/dev use — Cloudflare caps them
   at 200 in-flight requests and doesn't offer an uptime SLA for them.

### Setup — named tunnel (persistent subdomain, requires a free Cloudflare account + a domain on Cloudflare)

If you want a stable URL instead of a new random one every time:

1. `cloudflared tunnel login` (opens a browser to authorize against your
   Cloudflare account/domain).
2. `cloudflared tunnel create keystone`
3. Point a DNS record at it: `cloudflared tunnel route dns keystone
   keystone.yourdomain.com`
4. Create a config file (typically `~/.cloudflared/config.yml`):

   ```yaml
   tunnel: keystone
   credentials-file: /path/to/<tunnel-id>.json
   ingress:
     - hostname: keystone.yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```

5. Run it: `cloudflared tunnel run keystone`

Full, current reference:
[developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/).

---

## Which one should I use?

- **Just want your own phone to reach your own Keystone instance from
  anywhere?** → Tailscale. No exposure, no auth layer needed, set-and-forget.
- **Want to hand someone else a link right now, understand the exposure,
  and don't want to install anything on their device?** → Cloudflare Tunnel
  (quick tunnel), for as short a time as possible.
- **Not sure?** → Tailscale. It's the safer default and this doc recommends
  it for a reason.
