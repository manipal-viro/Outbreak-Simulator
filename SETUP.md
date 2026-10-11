# Outbreak Investigation Simulator: setup

## Folder layout (upload all of this to GitHub Pages)
index.html, sw.js, manifest.webmanifest, firebase-config.js, firestore.rules
data/cases.json, data/case-01.json
icons/ (favicon + app icons)
assets/images/ (scene-*.jpg, miv-logo.jpg, case-01.jpg for the home card)

## Image sizes
- Favicon: 32x32 and 16x16 PNG, plus favicon.ico (16, 32, 48)
- App icon: 192x192 and 512x512 PNG (square, any background)
- Maskable icon: 512x512 PNG, keep the logo inside the centre 320x320 (80% safe zone is the limit)
- Apple touch icon: 180x180 PNG, no transparency
- Splash (Android): built from icon-512 + background colour in manifest.webmanifest
- Splash (iOS, optional): one 2732x2732 PNG, logo centred inside the middle 1000x1000
- Header logo: wide PNG with transparent background, at least 760 px wide
- Case cover images (home page): 1200x675 JPG (16:9), under 200 KB, named case-01.jpg, case-02.jpg ...

## Firebase
1. Create a project at console.firebase.google.com and add a Web app.
2. Authentication > Sign-in method: enable Email/Password, Google, Apple and Anonymous (Apple also needs your Apple developer details).
3. Authentication > Settings > Authorized domains: add your GitHub Pages domain (yourname.github.io).
4. Firestore Database: create in production mode, then paste firestore.rules into the Rules tab and publish.
5. Paste your web app config into firebase-config.js.

Data stored per user (namespaced by app id, so several apps can share one Firebase project):
apps/{appId}/users/{uid}                    name, designation, institute, email
apps/{appId}/users/{uid}/progress/{caseId}  saved game state
apps/{appId}/users/{uid}/results/{caseId}   final grade and score breakdown

## App id (several apps on one GitHub account)
GitHub Pages apps under the same account share one origin, so storage is shared too. Give each app its own id:
- firebase-config.js: add  window.APP_ID='outbreak-sim';  (keep your own Firebase keys, do not overwrite the file)
- sw.js: set  const APP_ID='outbreak-sim';  to the same value
The id prefixes cache names, local storage keys (offline progress, profile) and Firestore paths.

## Offline use
Anyone can choose "Continue offline on this device": progress, profile and results stay in local storage.
Signing in later syncs the newest saved progress to the cloud.

## Releasing an update
Edit files, upload, then bump VERSION in sw.js (v1 to v2). Online users get the new files at once
(network-first) and see an "Update now" banner when sw.js changed. Offline users keep the cached copy.
