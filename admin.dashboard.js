import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getDoc, doc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js'
import firebase from './login.firebase.js';
const { auth, db } = firebase;
const { bcrypt } = dcodeIO;

const dataForm = document.getElementById('data-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const yearInput = document.getElementById('year');
const urlInput = document.getElementById('privateUrl');
const logoutBtn = document.getElementById('btn-logout');

const redirectToLogin = () => {
  window.location.replace('./index.html');
};

onAuthStateChanged(auth, (user) => {
  if (!user) {
    redirectToLogin();
  }
});

const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const generateEncryptedUrl = (url, password) => {
  var encrypted = CryptoJS.AES.encrypt(url, password);
  return encrypted;
}

const createData = async (
  username,
  password,
  year,
  url
) => {
  if (!password) {
    throw new Error('Password tidak boleh kosong untuk akun baru!');
  }
  if (!year) {
    throw new Error('Tahun anggaran tidak boleh kosong!');
  }
  const docData = {};
  const docPass = {};
  // generate hashed password
  try {
    const hashedPassword = await generateHashedPassword(password);
    docData.password = hashedPassword;
    docPass.password = password;
  } catch (error) {
    throw new Error('Tidak bisa membuat password!');
  }
  // encrypt url
  const encryptedUrl = generateEncryptedUrl(url, password).toString();
  docData[year] = encryptedUrl;
  
  const docIndex = doc(db, 'users', username);
  const docPassIndex = doc(db, 'passwords', username);
  
  // save data to firebase
  await setDoc(docIndex, docData);
  await setDoc(docPassIndex, docPass);
  return true;
}

const updateData = async (
  username,
  password,
  year,
  url
) => {
  let oriPass = null;
  const docNewData = {};
  const docNewPass = {};
  // password process for update
  if (password) {
    const hashedPassword = await generateHashedPassword(password);
    docNewData.password = hashedPassword;
    docNewPass.password = password;
  } else {
    // get original password
    const docPassIndex = doc(db, 'passwords', username);
    const oriPassDoc = await getDoc(docPassIndex);
    if (oriPassDoc.exists()) {
      oriPass = oriPassDoc.data().password;
    }
  }
  if (year) {
    if (!docNewPass.password && !oriPass) {
      throw new Error('Password belum dibuat, mohon masukkan password!');
    }
    const passForEncrypt = oriPass ? oriPass : docNewPass.password;
    const encryptedUrl = generateEncryptedUrl(url, passForEncrypt).toString();
    docNewData[year] = encryptedUrl;
  }
  // save password to firebase
  if (docNewPass.password) {
    const docPassIndex = doc(db, 'passwords', username);
    await updateDoc(docPassIndex, docNewPass);
  }
  // save data to firebase
  if (docNewData.password || docNewData[year]) {
    const docIndex = doc(db, 'users', username);
    await updateDoc(docIndex, docNewData);
  }
  return true;
}

dataForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const username = usernameInput.value;
    const password = passwordInput.value.trim() == '' ? null : passwordInput.value;
    const year = yearInput.value.trim() == '' ? null : yearInput.value;
    const url = urlInput.value;
    
    // update firestore
    const userIndex = doc(db, 'users', username);
    const userDoc = await getDoc(userIndex);

    // Do upsert
    if (userDoc.exists() || userDoc?.data()?.[year]) {
      const isUpdated = await updateData(
        username,
        password,
        year,
        url
      );
      if (isUpdated) {
        alert('Berhasil mengupdate data');
        dataForm.reset();
        usernameInput.value = username;
      }
    } else {
      const isCreated = await createData(
        username,
        password,
        year,
        url,
      );
      if (isCreated) {
        alert('Berhasil menambahkan data');
        dataForm.reset();
        usernameInput.value = username;
      }
    }
  } catch (error) {
    alert(`Proses Gagal: ${error.message}`);
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    redirectToLogin();
  } catch (error) {
    alert(`Gagal Logout: ${error.message}`);
  }
});
