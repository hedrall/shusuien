// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAypxEAahk0VDCfXSZ1bZ90vomSIUO3kLA',
  authDomain: 'shusuien-dee8f.firebaseapp.com',
  projectId: 'shusuien-dee8f',
  storageBucket: 'shusuien-dee8f.appspot.com',
  messagingSenderId: '234514318576',
  appId: '1:234514318576:web:e8292ddad1a5194f75ee35',
  measurementId: 'G-0D55JDLH58',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
