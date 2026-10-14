# Outbreak Investigation Simulator: setup

## Where every file goes (repo root = GitHub Pages root)
```
index.html
sw.js
manifest.webmanifest
firebase-config.js            <- your own (see firebase-config.example.js)
firestore.rules               <- paste into Firebase > Firestore > Rules
README.md  SETUP.md  CASE_PROMPT.md
data/
  cases.json                  <- list of cases on the home page
  case-01.json                <- Case 1
  lab-catalog.json            <- shared samples + tests (all cases)
icons/
  favicon-16.png  favicon-32.png  favicon.ico
  apple-touch-icon.png
  icon-192.png  icon-512.png  icon-maskable-512.png
assets/images/
  miv-logo.jpg
  scene-dho.jpg scene-doctor.jpg scene-asha.jpg scene-jaggu.jpg scene-kamala.jpg scene-baba.jpg
  case-01.jpg                 <- home page cover for Case 1 (1200x675)
```

## Image sizes
- Favicon: favicon-16.png 16x16, favicon-32.png 32x32, favicon.ico (16/32/48)
- App icon: icon-192.png 192x192, icon-512.png 512x512
- Maskable icon: icon-maskable-512.png 512x512, logo inside the centre 320x320
- Apple touch icon: apple-touch-icon.png 180x180, no transparency
- Splash: Android builds it from icon-512 + manifest background colour (an in-app splash also shows)
- Case cover (home page): case-01.jpg, case-02.jpg ... 1200x675 JPG under 200 KB
- Scene images: 1448x1086 JPG

## Firebase
1. Authentication > Sign-in method: enable Email/Password, Google, Apple, Anonymous.
2. Authentication > Settings > Authorized domains: add yourname.github.io
3. Firestore: create the database, then paste firestore.rules into Rules and publish.
4. firebase-config.js must be a PLAIN script (see firebase-config.example.js). Do not paste the
   "import { initializeApp } ..." lines from the console. Include measurementId for analytics.

Data per user (namespaced by app id):
apps/{appId}/users/{uid}                    name, designation, institute, email
apps/{appId}/users/{uid}/progress/{caseId}  saved game state
apps/{appId}/users/{uid}/results/{caseId}   final grade and score breakdown

## Analytics (Google Analytics 4 via your measurementId)
Events sent: page_view (automatic), case_start, case_resume, case_complete (case_id, grade, score),
case_failed (trust reached 0), login (method), pwa_install. Every event also carries app_id.
In Analytics: Reports > Engagement > Events. Mark case_complete as a key event. To split by case or grade,
add custom dimensions (Admin > Custom definitions > event scope): case_id, grade, app_id.

## Offline use
"Continue offline on this device" keeps progress, profile and results in local storage.
Signing in later syncs the newest saved progress.

## Releasing an update
Upload changed files, then bump VERSION in sw.js (v3 to v4). Online users get new files immediately
(network-first) and see an "Update now" bar when sw.js changed.

## Adding a case
Use CASE_PROMPT.md. You only add data/case-0N.json, an entry in data/cases.json, the images, and bump VERSION in sw.js.

## Google Sheet visitor log (who visited, who finished which case)
1. Create a Google Sheet, open Extensions > Apps Script, paste google-sheet-logger.gs.
2. Change TOKEN to a secret word, run setup() once and approve permissions.
3. Deploy > New deployment > Web app (Execute as: Me, Access: Anyone). Copy the /exec URL.
4. In firebase-config.js set  window.SHEET_URL='<the /exec URL>';  window.SHEET_TOKEN='<your secret word>';
5. Re-upload index.html and sw.js.
Tabs created: Log (one row per event, with a readable Description such as
"Asha Rao completed Case-01 successfully at 01/01/2026 13:55 (Grade B, 82/100)"),
Summary (visits, starts, success/failed per case) and Results (finished cases only).
Visitors who chose "Continue offline" are logged anonymously (no name or email).
Tell users in a privacy notice that name, designation, institute and email are logged.
The token only stops casual spam; anyone can read it in the page source.
