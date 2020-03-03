"use strict";
exports.__esModule = true;
var firebase_1 = require("./firebase");
var Authentication = (function () {
    function Authentication(div) {
        this.div = div;
    }
    Authentication.prototype.addAdminCloudFunction = function (adminForm, callback) {
        adminForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var adminEmail = adminForm.email.value;
            var addAdminRole = firebase_1.functions.httpsCallable('addAdminRole');
            addAdminRole({ email: adminEmail }).then(function (result) {
                console.log(result);
                callback();
            })["catch"](function (err) {
                console.log(err);
                alert("There was an error: view console");
            });
        });
    };
    Authentication.prototype.signup = function () {
        var _this = this;
        var html = "\n    <form class=\"signup-form\">\n      <div class=\"form-group\">\n        <label for=\"inputEmail\">Email address</label>\n        <input type=\"email\" class=\"form-control\" id=\"inputEmail\" aria-describedby=\"emailHelp\" placeholder=\"Enter email\" required>\n        <small id=\"emailHelp\" class=\"form-text text-muted\">Please DON'T use your school email-address to sign up.</small>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"inputPassword\">Password</label>\n        <input type=\"password\" class=\"form-control\" id=\"inputPassword\" placeholder=\"Password\" required>\n        <small id=\"emailHelp\" class=\"form-text text-muted\">Your password is safe here - not even I can possibly view it.</small>\n      </div>\n      <div class=\"form-group\">\n        <label for=\"confirmPassword\">Confirm Password</label>\n        <input type=\"password\" class=\"form-control\" id=\"confirmPassword\" placeholder=\"Password\" required>\n      </div>\n      <button type=\"submit\" class=\"btn btn-dark\">Submit</button>\n    </form>\n    <div class=\"error text-danger d-none\"></div>\n    ";
        this.div.innerHTML = html;
        var form = document.querySelector(".signup-form");
        var email = form.inputEmail;
        var password = form.inputPassword;
        var confirm = form.confirmPassword;
        var error = document.querySelector(".error");
        email.focus();
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (password.value === confirm.value) {
                _this.div.classList.add("d-none");
                firebase_1.auth.createUserWithEmailAndPassword(email.value, password.value)["catch"](function (err) {
                    error.textContent = err;
                    error.classList.remove("d-none");
                });
            }
            else {
                confirm.value = "";
                error.innerHTML = "Password and Confirm Password are not the same";
            }
        });
    };
    Authentication.prototype.login = function () {
        var html = "\n      <form class=\"login-form\">\n        <div class=\"form-group\">\n          <label for=\"exampleInputEmail1\">Email address</label>\n          <input type=\"email\" class=\"form-control\" id=\"inputEmail\" aria-describedby=\"emailHelp\" placeholder=\"Enter email\" required>\n        </div>\n        <div class=\"form-group\">\n          <label for=\"exampleInputPassword1\">Password</label>\n          <input type=\"password\" class=\"form-control\" id=\"inputPassword\" placeholder=\"Password\" required>\n        </div>\n        <button type=\"submit\" class=\"btn btn-dark\">Submit</button>\n      </form>\n      <div class=\"error text-danger d-none\"></div>\n    ";
        this.div.innerHTML = html;
        var form = document.querySelector(".login-form");
        var email = form.inputEmail;
        var password = form.inputPassword;
        var error = document.querySelector(".error");
        email.focus();
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            firebase_1.auth.signInWithEmailAndPassword(email.value, password.value)["catch"](function (err) {
                error.textContent = err;
                error.classList.remove("d-none");
            });
        });
    };
    Authentication.prototype.listener = function (callback) {
        var _this = this;
        firebase_1.auth.onAuthStateChanged(function (user) {
            if (user) {
                user.getIdTokenResult()
                    .then(function (idTokenResult) {
                    user.admin = idTokenResult.claims.admin;
                    callback(user);
                });
            }
            else {
                _this.div.innerHTML = "";
                _this.user = undefined;
            }
        });
    };
    return Authentication;
}());
exports["default"] = Authentication;
