 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyBzYcVpYklej-ryxUEL6ZikXR3ifP8vCw8",
  authDomain: "quiz-application-4bec1.firebaseapp.com",
  projectId: "quiz-application-4bec1",
  storageBucket: "quiz-application-4bec1.firebasestorage.app",
  messagingSenderId: "1011079646031",
  appId: "1:1011079646031:web:a0eb3c379309097892133a",
  measurementId: "G-ZYMDZZVSLQ"
};
 
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
 