import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chatapp-2d5b8.firebaseapp.com",
  projectId: "react-chatapp-2d5b8",
  storageBucket: "react-chatapp-2d5b8.appspot.com",
  messagingSenderId: "42935551579",
  appId: "1:42935551579:web:814f19bf410bb37b42e17e",
  measurementId: "G-2K7XP2DMSK"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
