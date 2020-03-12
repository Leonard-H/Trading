"use strict";
exports.__esModule = true;
var settingsBtn = document.querySelector(".settings-btn");
var theme = localStorage.theme ? localStorage.theme : "default";
document.querySelector(".theme").setAttribute("href", "styles/" + theme + ".css");
var defaultChecked = (theme === "default") ? "checked=\"checked\"" : "";
var darkChecked = (theme === "dark") ? "checked=\"checked\"" : "";
settingsBtn.addEventListener("click", function () {
    var html = "\n    <div class=\"settings white-card\">\n      <form class=\"theme\">\n\n        <h2>Choose your theme (currently still not working)</h2>\n\n        <input id=\"default\" value=\"default\" type=\"radio\" " + defaultChecked + " name=\"theme\" disabled=\"true\"/>\n        <label for=\"default\">Default</label>\n        <br>\n\n        <input id=\"dark\" value=\"dark\" type=\"radio\" " + darkChecked + " name=\"theme\" disabled=\"true\"/>\n        <label for=\"dark\">Dark (Experimental)</label>\n        <br>\n\n        <input type=\"submit\" />\n\n      </form>\n    </div>\n  ";
    Array.from(document.querySelector(".white-cards").children).forEach(function (child) {
        child.classList.add("d-none");
    });
    if (document.querySelector(".settings"))
        return null;
    document.querySelector(".white-cards").innerHTML += html;
    var form = document.querySelector(".theme");
    console.log(theme);
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log(form.theme.value);
        localStorage.theme = form.theme.value;
    });
});
exports["default"] = {};
