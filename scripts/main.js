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
const join = document.querySelector(".join-game");
const joinForm = document.querySelector(".join-form");
const display = document.querySelector(".display");



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


joinForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = joinForm.enter.value;
  if (value){
    join.classList.add("d-none");
    main.classList.remove("d-none");

    //setup game

    const resetDisplayStyle = () => {
      display.classList.remove("btn", "btn-dark", "text-muted");
      display.classList.add("font-weight-bold");
    };

    localStorage.counter = 0;

    range.addEventListener("change", () => {
      resultDiv.textContent = range.value + ", wait";
      range.setAttribute("disabled", true);
      localStorage.counter = range.value;
      display.classList.remove("text-muted");
      display.classList.add("btn", "btn-dark");
    });

    range.addEventListener("mousedown", () => {
      display.classList.add("text-muted");
      display.classList.remove("btn", "btn-dark", "font-weight-bold");
    });

    range.addEventListener("input", e => {
      display.classList.remove("d-none");
      display.innerText = e.target.value;
    });

    range.addEventListener("mouseup", () => {
      console.log(localStorage.counter, range.value, localStorage.counter == range.value);
      if (localStorage.counter == range.value){
        resetDisplayStyle();
      }
    });

    const enable = () => {
      range.removeAttribute("disabled");
    };

    display.addEventListener("click", e => {
      if (e.target.classList.contains("btn")){
        resetDisplayStyle();
        enable();
      }
    });

  }
});



//class instances
const authentication = new Authentication(authDiv);

const setUpUser = user => {

  authentication.addAdminCloudFunction(document.querySelector(".add-admin-form"));


  nav.classList.remove("d-none");
  start.classList.add("d-none");
  join.classList.remove("d-none");

  joinForm.enter.focus();

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
        setUpUser(user);
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
