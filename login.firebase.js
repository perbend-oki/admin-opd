import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6f8wSWRLsX5qjfY395jC6hO3OM_cpeII",
  authDomain: "login-page-opd.firebaseapp.com",
  projectId: "login-page-opd",
  storageBucket: "login-page-opd.appspot.com",
  messagingSenderId: "755213417386",
  appId: "1:755213417386:web:3fb3ec5fd3b6b5d1cb89d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const firebase = { db, auth };

export default firebase;