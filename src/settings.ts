const settingsBtn: HTMLLinkElement = document.querySelector(".settings-btn");
let theme = localStorage.theme ? localStorage.theme : "default";
document.querySelector(".theme").setAttribute("href", `styles/${theme}.css`);
let defaultChecked: string = (theme === "default") ? `checked="checked"` : "";
let darkChecked: string = (theme === "dark") ? `checked="checked"` : "";
settingsBtn.addEventListener("click", () => {
  const html = `
    <div class="settings white-card">
      <form class="theme">

        <h2>Choose your theme (currently still not working)</h2>

        <input id="default" value="default" type="radio" ${defaultChecked} name="theme" disabled="true"/>
        <label for="default">Default</label>
        <br>

        <input id="dark" value="dark" type="radio" ${darkChecked} name="theme" disabled="true"/>
        <label for="dark">Dark (Experimental)</label>
        <br>

        <input type="submit" />

      </form>
    </div>
  `;
  Array.from(document.querySelector(".white-cards").children).forEach((child: HTMLDivElement) => {
    child.classList.add("d-none");
  });
  if (document.querySelector(".settings")) return null;

  document.querySelector(".white-cards").innerHTML += html;
  const form: HTMLFormElement = document.querySelector(".theme");
  console.log(theme);
  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    console.log(form.theme.value);
    localStorage.theme = form.theme.value;
  });
});

export default {};
