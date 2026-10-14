// Copy this to firebase-config.js and fill in YOUR values (Firebase console > Project settings > Your apps > Web app).
// It must be a plain script: do NOT paste the "import { initializeApp } ..." lines from the Firebase console.
window.FIREBASE_CONFIG={
  apiKey:"YOUR_API_KEY",
  authDomain:"YOUR_PROJECT.firebaseapp.com",
  projectId:"YOUR_PROJECT",
  storageBucket:"YOUR_PROJECT.appspot.com",
  messagingSenderId:"YOUR_SENDER_ID",
  appId:"YOUR_APP_ID",
  measurementId:"G-XXXXXXXXXX"   // Analytics (Google Analytics 4)
};
// Unique id for THIS app (cache, local storage and Firestore namespace). Must match APP_ID in sw.js.
window.APP_ID='outbreak-sim';

// Optional: Google Sheet visitor log (see google-sheet-logger.gs). Leave empty to turn it off.
window.SHEET_URL='';      // Web app URL ending in /exec
window.SHEET_TOKEN='';    // same secret word as TOKEN in the script
