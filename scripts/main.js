//get references
const start = document.querySelector(".start");
const authDiv = document.querySelector(".auth");
const signup = document.querySelector(".signup");
const login = document.querySelector(".login");

const range = document.querySelector("input[type=\"range\"]");
const nav = document.querySelector("nav");
const main = document.querySelector(".main");
const resultDiv = document.querySelector(".result");
const account = document.querySelector(".account");
const logout = document.querySelector(".logout-confirmed")
const join = document.querySelector(".join-game")

range.addEventListener("change", () => {
  resultDiv.textContent = range.value + ", wait";
  range.setAttribute("disabled", true);

});

const enable = () => {
  range.removeAttribute("disabled");
  resultDiv.textContent = "";
};



// authentication
signup.addEventListener("click", () => {
  authentication.signup();
});

login.addEventListener("click", () => {
  authentication.login();
});


document.querySelector(".add-admin").addEventListener("click", () => {
  join.classList.add("d-none");
  const addAdminForm = document.querySelector(".add-admin-form");

  addAdminForm.classList.remove("d-none");

  document.querySelector(".home-btn").addEventListener("click", () => {
    addAdminForm.classList.add("d-none");
    join.classList.remove("d-none");
  });

});



//class instances
const authentication = new Authentication(authDiv);

const setUpUser = user => {

  authentication.addAdminCloudFunction(document.querySelector(".add-admin-form"));


  nav.classList.remove("d-none");
  start.classList.add("d-none");
  join.classList.remove("d-none");


  // main.classList.remove("d-none");

  account.innerHTML = `Your email address: ${user.email}`;

  logout.addEventListener("click", () => {
    auth.signOut();

    nav.classList.add("d-none");
    start.classList.remove("d-none");
    join.classList.add("d-none");
    main.classList.add("d-none");

  });
}


authentication.listener(user => {

  db.collection("users").doc(user.uid)
    .get()
    .then(data => {
      if (data.data()){
        setUpUser(user)
      } else {

          const html = `
          <form class="nameForm">
            <div class="form-group">
              <label for="name">Type in your real name (first + last):</label>
              <input type="text" class="form-control" id="name" placeholder="e.g. Donald Trump">
            </div>
            <button type="submit" class="btn btn-dark">Submit</button>
          </form>
          `;

          authDiv.innerHTML = html;
          authDiv.classList.remove("d-none");

          const form = document.querySelector(".nameForm");

          form.addEventListener("submit", e => {
            e.preventDefault();

            db.collection("users").doc(user.uid)
              .set({
                username: form.name.value
              })
              .then(() => {
                setUpUser(user);
              })
              .catch(err => console.log(err));

          });

      }
    })
});
