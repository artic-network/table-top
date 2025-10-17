# frogspawn — GitHub Pages + Firebase Realtime DB example

This shows a minimal example of hosting two pages on GitHub Pages:

- `control.html` — a page with an input and a button that writes a string into a Firebase Realtime Database.
- `viewer.html` — a page that reads that string from the Realtime Database and updates when it changes (via realtime listener) and also has a polling fallback.

How it works
- `control.html` writes a JSON object to the path `/currentMessage` in your Firebase Realtime Database.
- `viewer.html` uses `onValue()` (realtime listener) to immediately get updates. It also includes a polling fallback using `get()` every few seconds.

Security note
- For testing you can temporarily set Realtime Database rules to allow open read/write (see below). For production you should require authentication and lock down rules appropriately.

Setup steps
1. Create a Firebase project at https://console.firebase.google.com/.
2. In the Firebase console enable Realtime Database and create a database (choose location).
3. In the Realtime Database "Rules" tab for quick testing you can use:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
   - WARNING: This is insecure. Use only for testing. Configure proper rules before production.

4. In "Project settings" -> "General" add a web app and copy the Firebase configuration object (apiKey, authDomain, databaseURL, etc.)
5. Edit `docs/control.html` and `docs/viewer.html` and replace the placeholder `firebaseConfig` object with your project's values.
6. Add these files to your repository (see the `docs/` folder below). In repository Settings -> Pages set the Source to the `main` branch and the `docs/` folder (or whichever branch/folder you prefer). After a minute your pages will be available at:
   - https://<your-github-username>.github.io/<repo>/control.html
   - https://<your-github-username>.github.io/<repo>/viewer.html

Files included
- docs/control.html — sends strings to the DB
- docs/viewer.html — displays strings in realtime and via polling