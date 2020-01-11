class Authentication{
  constructor(div){
    this.div = div;
  }
  addAdminCloudFunction(adminForm){
    adminForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const adminEmail = adminForm.email.value;
      const addAdminRole = functions.httpsCallable('addAdminRole');
      addAdminRole({ email: adminEmail }).then(result => {
        console.log(result);
        toggleActiveCard(join);
      }).catch(err => {
        console.log(err);
        alert("There was an error: view console");
      });
    });
  }
  signup(){
    const html = `
    <form class="signup-form">
      <div class="form-group">
        <label for="inputEmail">Email address</label>
        <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" required>
        <small id="emailHelp" class="form-text text-muted">I'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="inputPassword">Password</label>
        <input type="password" class="form-control" id="inputPassword" placeholder="Password" required>
        <small id="emailHelp" class="form-text text-muted">Your password is safe here - not even I can possibly view it.</small>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" class="form-control" id="confirmPassword" placeholder="Password" required>
      </div>
      <button type="submit" class="btn btn-dark">Submit</button>
    </form>
    <div class="error text-danger d-none"></div>
    `;

    this.div.innerHTML = html;

    const form = document.querySelector(".signup-form");

    const email = form.inputEmail;
    const password = form.inputPassword;
    const confirm = form.confirmPassword;
    const error = document.querySelector(".error");

    email.focus();

    form.addEventListener("submit", e => {
      e.preventDefault();

      //signup
      if (password.value === confirm.value){
        this.div.classList.add("d-none");

        auth.createUserWithEmailAndPassword(email.value, password.value)
          .catch(err => {
            error.textContent = err;
            error.classList.remove("d-none");
          });




      } else {
        confirm.value = "";
        error.innerHTML = "Password and Confirm Password are not the same"
      }
    });




  }
  login(){
    const html = `
      <form class="login-form">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" required>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="inputPassword" placeholder="Password" required>
        </div>
        <button type="submit" class="btn btn-dark">Submit</button>
      </form>
      <div class="error text-danger d-none"></div>
    `;

    this.div.innerHTML = html;

    const form = document.querySelector(".login-form");

    const email = form.inputEmail;
    const password = form.inputPassword;
    const error = document.querySelector(".error");

    email.focus();

    form.addEventListener("submit", e => {
      e.preventDefault();

      //login
      auth.signInWithEmailAndPassword(email.value, password.value)
        .catch(err => {
          error.textContent = err;
          error.classList.remove("d-none");
        });
    });
  }
  listener(callback){

    auth.onAuthStateChanged(user => {
      if (user){

        user.getIdTokenResult()
          .then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            callback(user);
          })


      } else {
        this.div.innerHTML = "";
        this.user = undefined;
      }
    });
  }
}
