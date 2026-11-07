# 46 Holiday Drive Watering (PWA)

Static, installable web app. No backend, no build step, no dependencies.

## Files

- `index.html` - the app (unchanged design and behaviour)
- `manifest.json` - PWA manifest (name, colours, icons)
- `sw.js` - service worker, cache-first, versioned cache (`watering-v1`)
- `icons/` - 512, 192, 180 (apple-touch-icon) and a maskable 512
- `vercel.json` - tells Vercel this is a static site with no build

## Test locally on your phone

From inside this folder on your computer:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Then on your phone (same Wi-Fi) open `http://<your-computer-ip>:8080/`.
Find your IP with `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows).
Note: "Add to Home Screen" and offline mode need HTTPS, so test those on
the Vercel URL. Plain HTTP on your LAN is fine for checking layout.

## Deploy to Vercel

```bash
npx vercel login
npx vercel --prod
```

Accept the defaults when asked (no framework, no build command, output `.`).

## Updating the app

After editing `index.html` or the icons, bump `CACHE_VERSION` in `sw.js`
(v1 -> v2) so installed phones fetch the new files instead of the old cache.
