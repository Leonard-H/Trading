"use strict";
exports.__esModule = true;
var firebase_1 = require("./firebase");
console.log(firebase_1.db, firebase_1.auth);
var start = document.querySelector(".start");
var authDiv = document.querySelector(".auth");
var signup = document.querySelector(".signup");
var login = document.querySelector(".login");
var gameControl = document.querySelector(".game-control");
var range = document.querySelector("input[type=\"range\"]");
var nav = document.querySelector("nav");
var main = document.querySelector(".main");
var resultDiv = document.querySelector(".result");
var account = document.querySelector(".account");
var logout = document.querySelector(".logout-confirmed");
var join = document.querySelector(".join-game");
var joinForm = document.querySelector(".join-form");
var display = document.querySelector(".display");
signup.addEventListener("click", function () {
    authentication.signup();
});
login.addEventListener("click", function () {
    authentication.login();
});
var toggleActiveCard = function (card) {
    Array.from(document.querySelector(".white-cards").children).forEach(function (child) {
        child.classList.add("d-none");
    });
    card.classList.remove("d-none");
};
document.querySelector(".home-btn").addEventListener("click", function () {
    toggleActiveCard(join);
});
document.querySelector(".add-admin").addEventListener("click", function () {
    toggleActiveCard(document.querySelector(".add-admin-form"));
});
document.querySelector(".new-session").addEventListener("click", function (e) {
    e.preventDefault();
    var htmlInitSession = "\n    <form class=\"init-session\">\n      <div class=\"form-group\">\n        <label for=\"sessionId\">Give the session an id:</label>\n        <input type=\"text\" class=\"form-control\" id=\"sessionId\" placeholder=\"Session id\" autocomplete=\"off\" required>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"stock\">Type in the name of the stock:</label>\n        <input type=\"text\" class=\"form-control\" id=\"stock\" placeholder=\"Stock name\"autocomplete=\"off\" required>\n      </div>\n      <button type=\"submit\" class=\"btn btn-dark\">Submit</button>\n    </form>\n  ";
    gameControl.innerHTML = htmlInitSession;
    var initForm = document.querySelector(".init-session");
    var sessionId;
    initForm.addEventListener("submit", function (e) {
        e.preventDefault();
        localStorage.lastChartVal = 0;
        sessionId = initForm.sessionId.value.trim();
        game.newSession({
            id: sessionId,
            stockName: initForm.stock.value
        })
            .then(function () {
            gameControl.innerHTML = "\n        <div class=\"text-center content-div\">\n          <span style=\"color: lime; font-size: 2em; font-weight: bold\">&#10003;</span><br>\n          <span>Success! Now share the id with your friends.</span>\n        </div>\n        <div class=\"text-center\">\n          <button class=\"next btn btn-dark\" style=\"margin-top: 20px;\">next</button>\n        <div>\n      ";
            var contentDiv = document.querySelector(".content-div");
            var next = document.querySelector(".next");
            next.onclick = function () {
                setTimeout(function () { return next.blur(); }, 50);
                contentDiv.innerHTML = "\n          <h1>" + sessionId + "</h1>\n        ";
                next.onclick = gameControlFunction;
            };
        })["catch"](function (err) {
            console.log(err);
            alert("There was an error: view console");
        });
    });
    toggleActiveCard(gameControl);
});
var gameControlFunction = function () {
    firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid)
        .get()
        .then(function (data) {
        localStorage.currentSessionOfAdmin = data.data().currentSession;
        firebase_1.db.collection("sessions").doc(localStorage.currentSessionOfAdmin)
            .get()
            .then(function (session) {
            gameControl.innerHTML = "\n            <small class=\"text-muted\" style=\"letter-spacing: 1.1px; float: left\">\n              Session id:  " + data.data().currentSession + "\n            </small>\n            <small class=\"text-muted\" style=\"letter-spacing: 1.1px; float: right\">\n              Stock: " + session.data().stock + "\n            </small>\n\n            <form class=\"add-value\" style=\"margin-top: 35px\">\n              <div class=\"form-group\">\n                <label for=\"sessionId\">New value:</label>\n                <div class=\"input-group\">\n                  <input type=\"text\" class=\"form-control\" id=\"value\" placeholder=\"value\" autocomplete=\"off\" required>\n                  <div class=\"input-group-append\">\n                    <button type=\"submit\" class=\"btn btn-dark\">Submit</button>\n                  </div>\n                </div>\n              </div>\n              <button type=\"button\" class=\"btn btn-dark block\">Block all users</button>\n              <button type=\"button\" class=\"btn btn-dark\" style=\"float: right\" data-toggle=\"modal\" data-target=\"#endSessionModal\">End session</button>\n            </form>\n          ";
            var userList = new Set();
            firebase_1.db.collection("users")
                .where("currentSession", "==", localStorage.currentSessionOfAdmin)
                .where("occupiedAsAdmin", "==", false)
                .onSnapshot(function (querySnapshot) {
                querySnapshot.docs.forEach(function (doc) {
                    userList.add(doc.id);
                    localStorage.setItem("userList", JSON.stringify(Array.from(userList)));
                });
            });
            var end = document.querySelector(".session-end-confirmed");
            end.addEventListener("click", function () {
                game.endSession({ id: data.data().currentSession })
                    .then(function () {
                    toggleActiveCard(join);
                });
            });
            var block = document.querySelector(".block");
            block.addEventListener("click", function () {
                Array.from(userList).forEach(function (user) {
                    game.disable(user);
                });
            });
            var addValueForm = document.querySelector(".add-value");
            addValueForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var chartFactor = Number(addValueForm.value.value.trim()) - Number(localStorage.lastChartVal);
                localStorage.lastChartVal = addValueForm.value.value;
                addValueForm.value.value = "";
                game.updateIndividualResults(userList, chartFactor)
                    .then(function (userValues) {
                    console.table(userValues);
                    game.updateRanking(userValues);
                })["catch"](function (err) { return console.log(err); });
            });
        })["catch"](function (err) { return console.log(err); });
    });
};
joinForm.addEventListener("submit", function (e) {
    e.preventDefault();
    localStorage.currentSessionOfUser = joinForm.enter.value.trim();
    setUpSession(localStorage.currentSessionOfUser, 0);
});
var setUpSession = function (id, firstNum) {
    var enable;
    firebase_1.db.collection("sessions").doc(id).get()
        .then(function (ses) {
        if (ses.data()) {
            if (ses.data().isLive) {
                if (id) {
                    firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid)
                        .get()
                        .then(function (user) {
                        if (user.data()[user.data().currentSession]) {
                            resultDiv.innerText = "$" + user.data()[user.data().currentSession];
                        }
                        else {
                            resultDiv.innerText = "$" + 0;
                        }
                        game.joinGame({ session: id, canAddValues: user.data().canAddValues })
                            .then(function () {
                            join.classList.add("d-none");
                            main.classList.remove("d-none");
                            localStorage.rangeVal = firstNum;
                            range.value = String(firstNum);
                            display.innerText = String(firstNum);
                            if (!user.data().canAddValues) {
                                range.setAttribute("disabled", "true");
                            }
                            var resetDisplayStyle = function () {
                                display.classList.remove("btn", "btn-dark", "text-muted");
                                display.classList.add("font-weight-bold");
                            };
                            range.addEventListener("mousedown", function () {
                                display.classList.add("text-muted");
                                display.classList.remove("btn", "btn-dark", "font-weight-bold");
                            });
                            range.addEventListener("input", function () {
                                display.classList.remove("d-none");
                                display.innerText = range.value;
                            });
                            range.addEventListener("mouseup", function () {
                                if (localStorage.rangeVal == range.value) {
                                    resetDisplayStyle();
                                }
                                else {
                                    display.classList.remove("text-muted");
                                    display.classList.add("btn", "btn-dark");
                                }
                            });
                            enable = function () {
                                range.removeAttribute("disabled");
                            };
                            if (user.data().canAddValues) {
                                enable();
                            }
                            display.addEventListener("click", function () {
                                if (display.classList.contains("btn")) {
                                    localStorage.rangeVal = range.value;
                                    resetDisplayStyle();
                                    game.addUserValue({ id: localStorage.currentSessionOfUser, value: Number(range.value) });
                                }
                            });
                            range.addEventListener("touchstart", function () {
                                display.classList.add("text-muted");
                                display.classList.remove("btn", "btn-dark", "font-weight-bold");
                            });
                            range.addEventListener("touchend", function () {
                                if (localStorage.rangeVal == range.value) {
                                    resetDisplayStyle();
                                }
                                else {
                                    display.classList.remove("text-muted");
                                    display.classList.add("btn", "btn-dark");
                                }
                            });
                        });
                        firebase_1.db.collection("rankings").doc(ses.id)
                            .onSnapshot(function (querySnapshot) {
                            var rankingsList = document.querySelector(".rankings-list");
                            var keys = Object.keys(querySnapshot.data());
                            var sortedKeys = keys.sort(function (a, b) {
                                return querySnapshot.data()[b] - querySnapshot.data()[a];
                            });
                            rankingsList.innerHTML = "";
                            sortedKeys.forEach(function (key, index) {
                                var you = key === user.data().username ? "you" : "";
                                rankingsList.innerHTML += "\n\n                            <li class=\"list-group-item " + you + "\">\n\n                              <span class=\"ranking\">" + (index + 1) + "</span>\n\n                              <div class=\"info\">\n                                <p>" + key + "</p>\n                                <small class=\"text-muted\">$" + querySnapshot.data()[key] + "</small>\n                              </div>\n\n                        ";
                            });
                            document.querySelector(".you").scrollIntoView();
                        });
                    })["catch"](function (err) { return console.log(err); });
                    var first5_1 = false;
                    var unsub1_1 = firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid)
                        .onSnapshot(function (querySnapshot) {
                        if (!querySnapshot.data().currentSession && first5_1) {
                            alert("the session has ended");
                            toggleActiveCard(join);
                            setTimeout(unsub1_1, 1000);
                        }
                        first5_1 = true;
                        if (first3) {
                            resultDiv.innerText =
                                querySnapshot.data()[querySnapshot.data().currentSession] ?
                                    "$" + querySnapshot.data()[querySnapshot.data().currentSession] :
                                    "$" + 0;
                            if (querySnapshot.data().canAddValues) {
                                enable();
                            }
                            else {
                                range.setAttribute("disabled", "true");
                            }
                        }
                        first3 = true;
                    });
                }
            }
            else {
                toggleActiveCard(join);
                alert("the session has ended");
            }
        }
        else {
            toggleActiveCard(join);
            alert("there is no such session");
        }
    });
    var first3 = false;
};
require("./settings");
var auth_1 = require("./auth");
var authentication = new auth_1["default"](authDiv);
var game_1 = require("./game");
var game = new game_1["default"]();
var setUpUser = function (user) {
    authentication.addAdminCloudFunction(document.querySelector(".add-admin-form"), function () {
        toggleActiveCard(join);
    });
    firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid)
        .get()
        .then(function (data) {
        account.innerHTML = "\n        <span>Your email address: '" + user.email + "'</span><br>\n        <span>Your name: '" + data.data().username + "'</span><br>\n        <span class=\"admin\">You are an admin</span>\n        <p><small class=\"text-muted\">Unfortunately, you can't edit your account yet.</small></p>\n      ";
        if (user.admin) {
            document.querySelectorAll(".admin").forEach(function (el) {
                el.classList.remove("d-none");
            });
        }
        else {
            document.querySelectorAll(".admin").forEach(function (el) {
                el.classList.add("d-none");
            });
        }
        nav.classList.remove("d-none");
        start.classList.add("d-none");
        if (data.data().currentSession && data.data().occupiedAsAdmin) {
            gameControlFunction();
            toggleActiveCard(gameControl);
        }
        else if (data.data().currentSession && !data.data().occupiedAsAdmin) {
            setUpSession(data.data().currentSession, localStorage.rangeVal);
        }
        else {
            toggleActiveCard(join);
            joinForm.enter.focus();
        }
    });
    logout.addEventListener("click", function () {
        firebase_1.auth.signOut();
        nav.classList.add("d-none");
        toggleActiveCard(start);
    });
};
authentication.listener(function (user) {
    firebase_1.db.collection("users").doc(user.uid)
        .get()
        .then(function (data) {
        var getName = function () {
            var html = "\n        <form class=\"nameForm\">\n          <div class=\"form-group\">\n            <label for=\"name\">Type in a nickname:</label>\n            <input type=\"text\" class=\"form-control\" id=\"nameInput\" placeholder=\"nickname\">\n          </div>\n          <button type=\"submit\" class=\"btn btn-dark\">Submit</button>\n        </form>\n        ";
            authDiv.innerHTML = html;
            authDiv.classList.remove("d-none");
            var form = document.querySelector(".nameForm");
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                firebase_1.db.collection("users").doc(user.uid)
                    .set({
                    username: form.nameInput.value.trim(),
                    currentSession: "",
                    occupiedAsAdmin: false,
                    canAddValues: false
                })
                    .then(function () {
                    setUpUser(user);
                })["catch"](function (err) { return console.log(err); });
            });
        };
        if (data.data()) {
            if (data.data().username) {
                setUpUser(user);
            }
            else {
                getName();
                setUpUser(user);
            }
        }
        else {
            getName();
            firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid).get()
                .then(function () {
                setUpUser(user);
            });
        }
    });
});
