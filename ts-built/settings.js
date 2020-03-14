"use strict";
exports.__esModule = true;
var settingsBtn = document.querySelector(".settings-btn");
var settingsDiv = document.querySelector(".settings");
var themeForm = document.querySelector(".theme-form");
var theme = localStorage.theme ? localStorage.theme : "default";
document.querySelector(".theme").setAttribute("href", "styles/" + theme + ".css");
var allButtons = document.querySelectorAll(".themeButton");
switch (theme) {
    case "default":
        themeForm["default"].setAttribute("checked", "checked");
        allButtons.forEach(function (btn) {
            btn.classList.add("btn-dark");
        });
        break;
    case "dark":
        themeForm.dark.setAttribute("checked", "checked");
        allButtons.forEach(function (btn) {
            btn.classList.add("btn-light");
        });
        break;
    default:
        themeForm["default"].setAttribute("checked", "checked");
        break;
}
settingsBtn.addEventListener("click", function () {
    Array.from(document.querySelector(".white-cards").children).forEach(function (child) {
        child.classList.add("d-none");
    });
    settingsDiv.classList.remove("d-none");
    console.log(theme);
    themeForm.addEventListener("change", function () {
        console.log(themeForm.theme.value);
        localStorage.theme = themeForm.theme.value;
        window.location.reload(false);
    });
});
exports["default"] = {};
