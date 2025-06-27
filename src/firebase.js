// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALPlbH4N83419C0UcgT7dRyoXprlgAPDw",
  authDomain: "lolingo-8c6ce.firebaseapp.com",
  projectId: "lolingo-8c6ce",
  storageBucket: "lolingo-8c6ce.firebasestorage.app",
  messagingSenderId: "255533109575",
  appId: "1:255533109575:web:8645ad39634662b319bc62",
  measurementId: "G-TNWSJ14RWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
export const db = getFirestore(app);