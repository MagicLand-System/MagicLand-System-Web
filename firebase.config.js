// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "magic-2e5fc.firebaseapp.com",
  projectId: "magic-2e5fc",
  storageBucket: "magic-2e5fc.appspot.com",
  messagingSenderId: "146280314024",
  appId: "1:146280314024:web:6416b5cc9165b4073d3e9d",
  measurementId: "G-J3R8GP6RP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app)