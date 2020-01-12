//get references
const start = document.querySelector(".start");
const authDiv = document.querySelector(".auth");
const signup = document.querySelector(".signup");
const login = document.querySelector(".login");

const gameControl = document.querySelector(".game-control");

const range = document.querySelector("input[type=\"range\"]");
const nav = document.querySelector("nav");
const main = document.querySelector(".main");
const resultDiv = document.querySelector(".result");
const account = document.querySelector(".account");
const logout = document.querySelector(".logout-confirmed");
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



// admin ui

const toggleActiveCard = card => {
  [...document.querySelector(".white-cards").children].forEach(child => {
    child.classList.add("d-none");
  });
  card.classList.remove("d-none");
};

document.querySelector(".home-btn").addEventListener("click", () => {
  toggleActiveCard(join);
});

document.querySelector(".add-admin").addEventListener("click", () => {
  toggleActiveCard(document.querySelector(".add-admin-form"));
});

document.querySelector(".new-session").addEventListener("click", e => {
  e.preventDefault();

  const htmlInitSession = `
    <form class="init-session">
      <div class="form-group">
        <label for="sessionId">Give the session an id:</label>
        <input type="text" class="form-control" id="sessionId" placeholder="Session id" autocomplete="off" required>
      </div>
      <div class="form-group">
        <label for="stock">Type in the name of the stock:</label>
        <input type="text" class="form-control" id="stock" placeholder="Stock name"autocomplete="off" required>
      </div>
      <button type="submit" class="btn btn-dark">Submit</button>
    </form>
  `;

  gameControl.innerHTML = htmlInitSession;

  const initForm = document.querySelector(".init-session");

  let sessionId;

  initForm.addEventListener("submit", e => {
    e.preventDefault();

    sessionId = initForm.sessionId.value;

    game.newSession({
      id: sessionId,
      stockName: initForm.stock.value,
      creator: auth.currentUser.uid
    })
    .then(() => {
      gameControl.innerHTML = `
        <div class="text-center content-div">
          <span style="color: lime; font-size: 2em; font-weight: bold">&#10003;</span><br>
          <span>Success! Now share the id with your friends.</span>
        </div>
        <div class="text-center">
          <button class="next btn btn-dark" style="margin-top: 20px;">next</button>
        <div>
      `;

      const contentDiv = document.querySelector(".content-div");
      const next = document.querySelector(".next");

      next.onclick = () => {
        setTimeout(() => next.blur(), 50);
        contentDiv.innerHTML = `
          <h1>${sessionId}</h1>
        `;
        next.onclick = gameControlFunction;
      };


    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });




  });


  toggleActiveCard(gameControl);
})


const gameControlFunction = () => {


  db.collection("users").doc(auth.currentUser.uid)
    .get()
    .then(data => {

      db.collection("sessions").doc(data.data().currentSession)
        .get()
        .then(session => {
          gameControl.innerHTML = `
            <small class="text-muted" style="letter-spacing: 1.1px; float: left">
              Session id:  ${data.data().currentSession}
            </small>
            <small class="text-muted" style="letter-spacing: 1.1px; float: right">
              Stock: ${session.data().stock}
            </small>

            <form class="add-value" style="margin-top: 35px">
              <div class="form-group">
                <label for="sessionId">New value:</label>
                <input type="text" class="form-control" id="value" placeholder="value" autocomplete="off" required>
              </div>
              <button type="submit" class="btn btn-dark">Submit</button>
              <button type="button" class="btn btn-dark" style="float: right" data-toggle="modal" data-target="#endSessionModal">End session</button>
            </form>
          `;


            // add a value
            const addValueForm = document.querySelector(".add-value");
            addValueForm.addEventListener("submit", e => {
              e.preventDefault();

              game.addValue({ id: data.data().currentSession, value: addValueForm.value.value });
              addValueForm.value.value = "";

            });


            // end the session
            const end = document.querySelector(".session-end-confirmed");
            end.addEventListener("click", () => {
              game.endSession({ id:  data.data().currentSession })
                .then(toggleActiveCard(join));;
            });


        });


    })
    .catch(err => console.log(err))



};


// general ui
joinForm.addEventListener("submit", e => {
  e.preventDefault();

  setUpSession(joinForm.enter.value, 0);
  game.addUserValue({ id: joinForm.enter.value, value: 0 });
});


// function which starts session ui

const setUpSession = (id, firstNum) => {

  db.collection("sessions").doc(id).get()
    .then(ses => {
      if (ses.data()){

        if (ses.data().isLive){


          if (id){
            // backend
            game.joinGame({ session: id })
              .then(() => {
                join.classList.add("d-none");
                main.classList.remove("d-none");

                //setup game
                localStorage.rangeVal = firstNum;
                range.value = firstNum;
                display.innerText = firstNum;


                const resetDisplayStyle = () => {
                  display.classList.remove("btn", "btn-dark", "text-muted");
                  display.classList.add("font-weight-bold");
                };

                range.addEventListener("change", () => {
                  localStorage.rangeVal = range.value;
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
                    resultDiv.textContent = range.value + ", wait";
                    range.setAttribute("disabled", true);
                    resetDisplayStyle();
                  }
                });
              })

              const unsub1 = db.collection("users").doc(auth.currentUser.uid)
                .onSnapshot(doc => {
                  db.collection("users").doc(doc.id).get()
                    .then(data => {
                      if (!data.data().currentSession){
                        alert("the session has ended");
                        toggleActiveCard(join);
                        setTimeout(unsub1, 1000);
                      }
                    });

                });


          }



        } else {

          toggleActiveCard(join);
          alert("the session has ended");

        }


      } else {

        toggleActiveCard(join);
        alert("there is no such session")

      }
    })



    // scoring



    let first = false;


    db.collection("users").doc(auth.currentUser.uid)
      .get()
      .then(user => {
        db.collection("users").doc(auth.currentUser.uid)
          .get()
          .then(user => {
            const unsub2 = db.collection("valuesOfChart")
              .where("ofSession", "==", user.data().currentSession)
              .orderBy("timestamp", "asc")
              .onSnapshot(querySnapshot => {

                let stockFactor;



                if (first){

                  game.createStockValueIdsArray(querySnapshot, array => {

                    if (array.length > 1){

                      const chartFactor = array[array.length-1].value - array[array.length-2].value;
                      console.log("Charfactor: " + chartFactor);

                    }
                  });


                }

                first = true;

              });

          });
      });



};









//class instances
const authentication = new Authentication(authDiv);
const game = new Game();

const setUpUser = (user, data) => {

  authentication.addAdminCloudFunction(document.querySelector(".add-admin-form"));

  db.collection("users").doc(auth.currentUser.uid)
    .get()
    .then(data => {
      account.innerHTML = `
        <span>Your email address: '${user.email}'</span><br>
        <span>Your name: '${data.data().username}'</span><br>
        <span class="admin">You are an admin</span>
        <p><small class="text-muted">Unfortunately, you can't edit your account yet.</small></p>
      `;

      if (user.admin){
        document.querySelectorAll(".admin").forEach(el => {
          el.classList.remove("d-none");
        })
      } else {
        document.querySelectorAll(".admin").forEach(el => {
          el.classList.add("d-none");
        })
      }

      nav.classList.remove("d-none");
      start.classList.add("d-none");

      // show users last activity
      if (data.data().currentSession && data.data().occupiedAsAdmin){

        gameControlFunction();
        toggleActiveCard(gameControl);

      } else if (data.data().currentSession && !data.data().occupiedAsAdmin){
        setUpSession(data.data().currentSession, localStorage.rangeVal);

      } else {
        toggleActiveCard(join);
        joinForm.enter.focus();
      }

    })

  logout.addEventListener("click", () => {
    auth.signOut();

    nav.classList.add("d-none");
    toggleActiveCard(start);

  });
}


authentication.listener(user => {

  db.collection("users").doc(user.uid)
    .get()
    .then(data => {

      const getName = () => {
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
              username: form.name.value,
              currentSession: "",
              occupiedAsAdmin: false
            })
            .then(() => {
              setUpUser(user, data);
            })
            .catch(err => console.log(err));

          });
      };



      if (data.data()){
        if (data.data().username){
          setUpUser(user, data);
        } else {
          getName();
          setUpUser(user, data);
        }
      } else {
        getName();
        db.collection("users").doc(auth.currentUser.uid).get()
          .then(data => {
            setUpUser(user, data);
          })
      }
    })
});
