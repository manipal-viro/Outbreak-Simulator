// Copy this to firebase-config.js and fill in YOUR values (Firebase console > Project settings > Your apps > Web app).
// It must be a plain script: do NOT paste the "import { initializeApp } ..." lines from the Firebase console.
window.FIREBASE_CONFIG={
    apiKey: "AIzaSyCjBWVyleX6wysJZBqrLAw72JOXzzdOCbs",
  authDomain: "virology-data.firebaseapp.com",
  projectId: "virology-data",
  storageBucket: "virology-data.firebasestorage.app",
  messagingSenderId: "679461942303",
  appId: "1:679461942303:web:02dd6306a9a92e74e5d12a",
  measurementId: "G-MYNBN5FGMB"
};
// Unique id for THIS app (cache, local storage and Firestore namespace). Must match APP_ID in sw.js.
window.APP_ID='outbreak-sim';

// Optional: Google Sheet visitor log (see google-sheet-logger.gs). Leave empty to turn it off.
window.SHEET_URL='https://script.google.com/macros/s/AKfycbwvVTYpyLZFJlwjdY-z0XoLW2HYemLj8UD9pF8C0ESlqZIYqk-AaTLvEAEFpm2YjI-a/exec';      // Web app URL ending in /exec
window.SHEET_TOKEN='Outsim_2026';    // same secret word as TOKEN in the script
