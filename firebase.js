// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz6mHwLqIf1dPb82VOu9di0wNGKCUKb5k",
  authDomain: "book-exchanger1.firebaseapp.com",
  projectId: "book-exchanger1",
  storageBucket: "book-exchanger1.appspot.com",
  messagingSenderId: "1078312150309",
  appId: "1:1078312150309:web:3b962f956b8ba198cee6cc",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const auth = firebase.auth();
export { auth };
