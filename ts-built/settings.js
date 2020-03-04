"use strict";
exports.__esModule = true;
var settingsBtn = document.querySelector(".settings-btn");
settingsBtn.addEventListener("click", function () {
    var html = "\n    <div class=\"settings white-card\">\n      <form class=\"theme\">\n        Default: <input type=\"radio\" /><br>\n        Dark: <input type=\"radio\" /><br>\n        <input type=\"submit\" />\n      </form>\n    </div>\n  ";
    var whiteCards = document.querySelector(".white-cards");
    Array.from(whiteCards.children).forEach(function (child) {
        child.classList.add("d-none");
    });
    if (!Array.from(whiteCards.children).contains(document.querySelector(".settings"))) {
        whiteCards.innerHTML += html;
    }
    var settings = document.querySelector(".settings");
});
exports["default"] = {};
