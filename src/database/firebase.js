// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBq563E7ZNqwUTawvri4kVhGgSQiI-1X4w",
  authDomain: "map-vetoes.firebaseapp.com",
  projectId: "map-vetoes",
  storageBucket: "map-vetoes.appspot.com",
  messagingSenderId: "377682550091",
  appId: "1:377682550091:web:1ab9254c94374068131cce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

export const lobbiesRef = collection(database, "lobbies");
