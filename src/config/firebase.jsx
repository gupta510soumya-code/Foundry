import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACFafp35ewOnS-p0PWBfVp3DslkjHn2d8",
  authDomain: "fir-403bb.firebaseapp.com",
  projectId: "fir-403bb",
  storageBucket: "fir-403bb.firebasestorage.app",
  messagingSenderId: "821643923932",
  appId: "1:821643923932:web:9b5773b6d3bdca0a0b7f19",
  measurementId: "G-28C10E4JPM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);