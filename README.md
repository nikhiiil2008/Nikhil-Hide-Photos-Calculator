# Nikhil Hide Photos Calculator — Android starter

This is a native Android project. It is separate from the GitHub Pages website.

## Build an APK using GitHub Actions
1. Upload the contents of this folder into the root of your existing GitHub repository (keep the `.github` folder).
2. Open the repository's **Actions** tab.
3. Choose **Build Android APK** and press **Run workflow**, or push a commit that changes app files.
4. Open the completed workflow run and download the artifact named `Nikhil-Hide-Photos-Calculator-debug`.
5. Extract the artifact ZIP on your Android phone and install `app-debug.apk`. Android may ask you to allow installs from that source.

## Important
- This is a starter implementation. Test it with non-sensitive sample photos first.
- Photos are encrypted with AES-GCM using an Android Keystore key and stored in app-private storage.
- PIN verification uses PBKDF2-HMAC-SHA256.
- After import, the app asks Android to show a system deletion confirmation for the original image (Android 11+). If Android cannot approve deletion, the original stays in Gallery and must be removed manually.
- Android uninstall, clearing app data, device reset, or loss of the Keystore key can make vault photos unrecoverable. Export/back up important photos before such actions.
- The starter can open and export imported photos, but does not yet include a full thumbnail gallery, cloud backup, or PIN recovery workflow.
- No photos are uploaded to a server.
