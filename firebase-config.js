// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Paste your Firebase web app config here (Firebase console > Project settings > Your apps > Web app).
// Leave the placeholders and the app runs in guest mode (progress saved on this device only).
window.FIREBASE_CONFIG={
  apiKey: "AIzaSyCjBWVyleX6wysJZBqrLAw72JOXzzdOCbs",
  authDomain: "virology-data.firebaseapp.com",
  projectId: "virology-data",
  storageBucket: "virology-data.firebasestorage.app",
  messagingSenderId: "679461942303",
  appId: "1:679461942303:web:02dd6306a9a92e74e5d12a",
  measurementId: "G-MYNBN5FGMB"
};
