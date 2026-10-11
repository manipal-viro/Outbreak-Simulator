// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjBWVyleX6wysJZBqrLAw72JOXzzdOCbs",
  authDomain: "virology-data.firebaseapp.com",
  projectId: "virology-data",
  storageBucket: "virology-data.firebasestorage.app",
  messagingSenderId: "679461942303",
  appId: "1:679461942303:web:02dd6306a9a92e74e5d12a",
  measurementId: "G-MYNBN5FGMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
