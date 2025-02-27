// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL9JEQ8-P_OBYbku0JoQjQ9ApIfj5KlQg",
  authDomain: "skillsphere-64155.firebaseapp.com",
  projectId: "skillsphere-64155",
  storageBucket: "skillsphere-64155.firebasestorage.app",
  messagingSenderId: "863089132803",
  appId: "1:863089132803:web:05a78ff25557e6f141d536",
  measurementId: "G-KS5NKN0EDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
