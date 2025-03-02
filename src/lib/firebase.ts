
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClrMmj3ZQnQCPQflgp8w_MJPBU73Pj3Lc",
  authDomain: "artify-ai-blog.firebaseapp.com",
  projectId: "artify-ai-blog",
  storageBucket: "artify-ai-blog.appspot.com",
  messagingSenderId: "982341520913",
  appId: "1:982341520913:web:7e3c9f3e6b5e9c5a3c23d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
