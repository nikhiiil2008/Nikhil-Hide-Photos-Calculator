# Nikhil Hide Photos Calculator

A lightweight, installable web app that looks like a calculator and opens a private gallery after a PIN is entered.

## Features
- Calculator-style front screen with Nikhil branding.
- First launch: enter a PIN of 4–12 digits and tap `=`.
- Later launches: enter the same PIN and tap `=`.
- Add images and videos; files are encrypted with AES-GCM before storage.
- PIN-derived encryption key uses PBKDF2-SHA-256 (250,000 iterations).
- Data is stored in this browser's IndexedDB on this device.
- Installable PWA with offline app-shell caching.

## Run / publish
1. Create a new GitHub repository named `nikhil-hide-photos-calculator`.
2. Upload all files from this folder to the repository root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
5. Open the Pages URL over HTTPS.

## Important privacy and recovery notes
- This is a browser-based vault, not a native Android app. It stores encrypted copies in the browser's local storage database; it does not automatically remove originals from the phone gallery.
- Use the app only on a trusted device and keep the device locked. Anyone with access to the unlocked browser session can view the vault.
- Clearing browser data, uninstalling the browser, or losing the device can permanently delete the vault. There is no PIN reset or cloud recovery. Export/backup functionality is not included in this starter version.
- If you forget the PIN, the encrypted files cannot be recovered. Keep the PIN safe.
- Serve over HTTPS (GitHub Pages does this) because Web Crypto and service workers require a secure context.
- Test with non-sensitive sample files first.

## Project files
- `index.html` — app structure
- `style.css` — interface
- `app.js` — calculator, PIN, encryption, gallery logic
- `manifest.webmanifest` — installable PWA metadata
- `sw.js` — offline app shell
- `icon.svg` — app icon
