// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC37b0R3FelAiiTAuTh-E3bzfHBFpueEdk",
  authDomain: "texmetrics-a6cd1.firebaseapp.com",
  projectId: "texmetrics-a6cd1",
  storageBucket: "texmetrics-a6cd1.appspot.com",
  messagingSenderId: "429762499417",
  appId: "1:429762499417:web:ce02260387291762343248",
  measurementId: "G-XFB5J0J28S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, analytics };