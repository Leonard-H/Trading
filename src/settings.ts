const settingsBtn: HTMLButtonElement = document.querySelector(".settings-btn");

settingsBtn.addEventListener("click", () => {
  const html = `
    <div class="settings white-card">
      <form class="theme">
        Default: <input type="radio" /><br>
        Dark: <input type="radio" /><br>
        <input type="submit" />
      </form>
    </div>
  `;
  const whiteCards = document.querySelector(".white-cards");
  Array.from(whiteCards.children).forEach((child: HTMLDivElement) => {
    child.classList.add("d-none");
  });
  whiteCards.innerHTML += html;
  const settings = document.querySelector(".settings");
});

export default {};
