"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var firebase_1 = require("./firebase");
var Game = (function () {
    function Game() {
    }
    Game.prototype.newSession = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                firebase_1.db.collection("sessions").doc(data.id).set({
                    isLive: true,
                    stock: data.stockName,
                    timestamp: firebase_1.firebase.firestore.FieldValue.serverTimestamp(),
                    creator: firebase_1.auth.currentUser.uid
                })["catch"](function (err) {
                    console.log(err);
                    alert("There was an error: view console");
                });
                firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid).update({
                    currentSession: data.id,
                    occupiedAsAdmin: true
                });
                firebase_1.db.collection("rankings").doc(data.id).set({});
                return [2];
            });
        });
    };
    ;
    Game.prototype.endSession = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                firebase_1.db.collection("rankings").doc(data.id)
                    .get()
                    .then(function (rank) {
                    var keys = Object.keys(rank.data());
                    var sortedKeys = keys.sort(function (a, b) {
                        return rank.data()[b] - rank.data()[a];
                    });
                    firebase_1.db.collection("sessions").doc(data.id).update({
                        isLive: false,
                        winner: sortedKeys[0]
                    })["catch"](function (err) {
                        console.log(err);
                        alert("There was an error: view console");
                    });
                });
                firebase_1.db.collection("users")
                    .where("currentSession", "==", data.id)
                    .get()
                    .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        firebase_1.db.collection("users").doc(doc.id)
                            .update({
                            currentSession: "",
                            canAddValues: false
                        });
                    });
                })["catch"](function (err) {
                    console.log(err);
                    alert("There was an error: view console");
                });
                firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid).update({
                    occupiedAsAdmin: false
                })["catch"](function (err) {
                    console.log(err);
                    alert("There was an error: view console");
                });
                return [2];
            });
        });
    };
    ;
    Game.prototype.updateIndividualResults = function (userList, chartFactor) {
        return __awaiter(this, void 0, void 0, function () {
            var userValues;
            return __generator(this, function (_a) {
                userValues = {};
                return [2, new Promise(function (resolve) {
                        Array.from(userList).forEach(function (user) {
                            firebase_1.db.collection("users").doc(user).update({
                                canAddValues: true
                            })
                                .then(function () { return console.log("successfully updated user: " + user); })["catch"](function (err) { return console.log(err); });
                            firebase_1.db.collection("valuesOfUsers")
                                .where("author", "==", user)
                                .where("ofSession", "==", localStorage.currentSessionOfAdmin)
                                .get()
                                .then(function (querySnapshot) {
                                if (querySnapshot.docs[0] && querySnapshot.docs[0].data().value <= 10 && querySnapshot.docs[0].data().value >= -10) {
                                    var userFactor = querySnapshot.docs[0].data().value;
                                    var result_1 = userFactor * chartFactor === -0 ? 0 : userFactor * chartFactor;
                                    var calculateResult_1 = function (userData) {
                                        var currentSession = userData.data().currentSession;
                                        var resultUntilNow = userData.data()[currentSession] ? userData.data()[currentSession] : 0;
                                        return resultUntilNow + result_1;
                                    };
                                    firebase_1.db.collection("users").doc(user)
                                        .get()
                                        .then(function (userData) {
                                        var _a;
                                        var finalResult = calculateResult_1(userData);
                                        var resultObject = (_a = {},
                                            _a[userData.data().currentSession] = finalResult,
                                            _a);
                                        firebase_1.db.collection("users").doc(userData.id).update(resultObject)
                                            .then(function () { return console.group("done"); })["catch"](function (err) { return console.log(err); });
                                        userValues[userData.data().username] = finalResult;
                                        if (Object.keys(userValues).length === __spreadArrays(userList).length)
                                            resolve(userValues);
                                    });
                                }
                            })["catch"](function (err) { return console.log(err); });
                        });
                    })];
            });
        });
    };
    ;
    Game.prototype.updateRanking = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                firebase_1.db.collection("rankings").doc(localStorage.currentSessionOfAdmin).update(data);
                return [2];
            });
        });
    };
    ;
    Game.prototype.joinGame = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (data.canAddValues) {
                    firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid).update({
                        currentSession: data.session,
                        occupiedAsAdmin: false
                    })["catch"](function (err) {
                        console.log(err);
                        alert("There was an error: view console");
                    });
                }
                else {
                    firebase_1.db.collection("users").doc(firebase_1.auth.currentUser.uid).update({
                        currentSession: data.session,
                        occupiedAsAdmin: false,
                        canAddValues: false
                    })["catch"](function (err) {
                        console.log(err);
                        alert("There was an error: view console");
                    });
                }
                return [2];
            });
        });
    };
    Game.prototype.addUserValue = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(data.id);
                if (data.value < -11 || data.value > 11) {
                    alert("Please make sure that the value you set is between -10 and 10.");
                    console.log(data.value);
                }
                else {
                    firebase_1.db.collection("valuesOfUsers")
                        .where("ofSession", "==", data.id)
                        .where("author", "==", firebase_1.auth.currentUser.uid)
                        .get()
                        .then(function (querySnapshot) {
                        if (querySnapshot.docs[0]) {
                            firebase_1.db.collection("valuesOfUsers").doc(querySnapshot.docs[0].id).update({
                                ofSession: data.id,
                                value: data.value
                            });
                        }
                        else {
                            console.log("justJoined");
                            firebase_1.db.collection("valuesOfUsers").add({
                                ofSession: data.id,
                                value: data.value,
                                author: firebase_1.auth.currentUser.uid
                            })["catch"](function (err) { return console.log(err); });
                        }
                    })["catch"](function (err) { return console.log(err); });
                }
                return [2];
            });
        });
    };
    Game.prototype.createStockValueIdsArray = function (querySnapshot, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var stockValueIds;
            return __generator(this, function (_a) {
                stockValueIds = [];
                querySnapshot.docs.forEach(function (doc) {
                    stockValueIds.push({
                        value: doc.data().value
                    });
                });
                callback(stockValueIds);
                return [2];
            });
        });
    };
    Game.prototype.disable = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                firebase_1.db.collection("users").doc(id).update({
                    canAddValues: false
                });
                return [2];
            });
        });
    };
    return Game;
}());
exports["default"] = Game;
