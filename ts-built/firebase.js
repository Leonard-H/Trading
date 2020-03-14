"use strict";
exports.__esModule = true;
var firebaseConfig = {
    apiKey: "AIzaSyADRNdtiNW1U6g4lKP5ppRuTS1M-i7sHqM",
    authDomain: "trading-d0033.firebaseapp.com",
    databaseURL: "https://trading-d0033.firebaseio.com",
    projectId: "trading-d0033",
    storageBucket: "trading-d0033.appspot.com",
    messagingSenderId: "53842051804",
    appId: "1:53842051804:web:bbfaa92e1dcc3edc72aa19"
};
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
exports.auth = auth;
var db = firebase.firestore();
exports.db = db;
var functions = firebase.functions();
exports.functions = functions;
console.log(auth);
