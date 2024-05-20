import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_0Bz2rJmzQ2GXuyzFxz922cL8UlUgl_Y",
  authDomain: "gowith-4c725.firebaseapp.com",
  projectId: "gowith-4c725",
  storageBucket: "gowith-4c725.appspot.com",
  messagingSenderId: "810839917221",
  appId: "1:810839917221:web:fbcd81f191354c8031034c"
};
  
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); 
export const auth = getAuth(app);
export const storage = getStorage(app);