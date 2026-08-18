import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7_cOEzMwVGDgqgSjHabRsIW5daQBXjDg",
  authDomain: "the-arcade-847c4.firebaseapp.com",
  projectId: "the-arcade-847c4",
  storageBucket: "the-arcade-847c4.firebasestorage.app",
  messagingSenderId: "259240284653",
  appId: "1:259240284653:web:9dbb24bd799de2643b17e4",
  measurementId: "G-NZZYSSQS9J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
