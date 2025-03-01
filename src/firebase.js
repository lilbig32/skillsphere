import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyDL9JEQ8-P_OBYbku0JoQjQ9ApIfj5KlQg',
  authDomain: 'skillsphere-64155.firebaseapp.com',
  projectId: 'skillsphere-64155',
  storageBucket: 'skillsphere-64155.firebasestorage.app',
  messagingSenderId: '863089132803',
  appId: '1:863089132803:web:05a78ff25557e6f141d536',
  measurementId: 'G-KS5NKN0EDD',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);