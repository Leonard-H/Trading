// Your web app's Firebase configuration
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

var firebaseConfig = {
  apiKey: "AIzaSyADRNdtiNW1U6g4lKP5ppRuTS1M-i7sHqM",
  authDomain: "trading-d0033.firebaseapp.com",
  databaseURL: "https://trading-d0033.firebaseio.com",
  projectId: "trading-d0033",
  storageBucket: "trading-d0033.appspot.com",
  messagingSenderId: "53842051804",
  appId: "1:53842051804:web:bbfaa92e1dcc3edc72aa19"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

export {
  auth,
  db,
  functions,
  firebase
}
