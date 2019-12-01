class Authentication{
  constructor(div){
    this.div = div;
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
    <div class="error"></div>
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


      console.log(password.value, confirm.value);

      //signup
      if (password.value === confirm.value){
        this.div.classList.add("d-none");

        auth.createUserWithEmailAndPassword(email.value, password.value)
          .catch(err => error.textContent = err);
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
      <div class="error"></div>
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
        .catch(err => console.log(err));
    });
  }
  listener(callback){

    auth.onAuthStateChanged(user => {
      if (user){
        //get reference to user
        callback(user);
      } else {
        this.div.innerHTML = "";
        this.user = undefined;
      }
    });
  }
  async getUser(){
    return await db.collection("users").doc(auth.W)
      .get()
      .then(data => data.data())
  }
}
