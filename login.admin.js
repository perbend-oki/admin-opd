import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import firebase from './login.firebase.js';
const { auth } = firebase;

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const redirectToDashboard = () => {
  window.location.href = './admin.dashboard.html';
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    redirectToDashboard();
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // login
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    if (userCredential) {
      redirectToDashboard();
    }
  } catch (error) {
    alert(error.message);
  }
});