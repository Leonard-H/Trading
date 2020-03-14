const settingsBtn: HTMLLinkElement = document.querySelector(".settings-btn");
const settingsDiv: HTMLDivElement = document.querySelector(".settings");
const themeForm: HTMLFormElement = document.querySelector(".theme-form");

let theme = localStorage.theme ? localStorage.theme : "default";
document.querySelector(".theme").setAttribute("href", `styles/${theme}.css`);

switch (theme) {
  case "default":
    themeForm.default.setAttribute("checked", "checked");
    break;

  case "dark":
    themeForm.dark.setAttribute("checked", "checked");
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
  themeForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    console.log(themeForm.theme.value);
    localStorage.theme = themeForm.theme.value;
  });
});

export default {};
