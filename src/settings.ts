const settingsBtn: HTMLLinkElement = document.querySelector(".settings-btn");
const settingsDiv: HTMLDivElement = document.querySelector(".settings");
const themeForm: HTMLFormElement = document.querySelector(".theme-form");

let theme = localStorage.theme ? localStorage.theme : "default";
document.querySelector(".theme").setAttribute("href", `styles/${theme}.css`);

const allButtons: NodeList = document.querySelectorAll(".themeButton");

switch (theme) {
  case "default":
    themeForm.default.setAttribute("checked", "checked");
    allButtons.forEach((btn: HTMLButtonElement) => {
      btn.classList.add("btn-dark");
    });
    break;

  case "dark":
    themeForm.dark.setAttribute("checked", "checked");
    allButtons.forEach((btn: HTMLButtonElement) => {
      btn.classList.add("btn-light");
    });
    break;

  default:
    themeForm.default.setAttribute("checked", "checked");
    break;
}

settingsBtn.addEventListener("click", () => {

  Array.from(document.querySelector(".white-cards").children).forEach((child: HTMLDivElement) => {
    child.classList.add("d-none");
  });
  settingsDiv.classList.remove("d-none");

  console.log(theme);
  themeForm.addEventListener("change", () => {
    console.log(themeForm.theme.value);
    localStorage.theme = themeForm.theme.value;
    window.location.reload(false);
  });
});

export default {};
