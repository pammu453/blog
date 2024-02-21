// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-57b95.firebaseapp.com",
    projectId: "mern-blog-57b95",
    storageBucket: "mern-blog-57b95.appspot.com",
    messagingSenderId: "257691272453",
    appId: "1:257691272453:web:e92cbec114895e9c92636c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);