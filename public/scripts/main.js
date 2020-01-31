const now = new Date();
if (now.getDate() === 5){
  document.querySelector(".navbar-brand").innerText = "Trading Game Turned Two Months Old Today"
}

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

    localStorage.lastChartVal = 0;

    sessionId = initForm.sessionId.value;

    game.newSession({
      id: sessionId,
      stockName: initForm.stock.value
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
                <div class="input-group">
                  <input type="text" class="form-control" id="value" placeholder="value" autocomplete="off" required>
                  <div class="input-group-append">
                    <button type="submit" class="btn btn-dark">Submit</button>
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-dark block">Block all users</button>
              <button type="button" class="btn btn-dark" style="float: right" data-toggle="modal" data-target="#endSessionModal">End session</button>
            </form>
          `;



          let userList = new Set();

          db.collection("users")
            .where("currentSession", "==", data.data().currentSession)
            .where("occupiedAsAdmin", "==", false)
            .onSnapshot(querySnapshot => {

              querySnapshot.docChanges().forEach(doc => {
                userList.add(doc.doc.id);
              });



            });

            // end the session
            const end = document.querySelector(".session-end-confirmed");
            end.addEventListener("click", () => {
              game.endSession({ id:  data.data().currentSession })
                .then(toggleActiveCard(join));;
            });


              // block button
              const block = document.querySelector(".block");
              block.addEventListener("click", () => {

              [...userList].forEach(user => {

                  game.disable(user);

                });

              });


            let chartFactor;


            // add a (chart) value
            const addValueForm = document.querySelector(".add-value");
            addValueForm.addEventListener("submit", e => {
              e.preventDefault();



              //calculations

              const chartFactor = addValueForm.value.value - Number(localStorage.lastChartVal);
              localStorage.lastChartVal = addValueForm.value.value;
              addValueForm.value.value = "";

              [...userList].forEach(user => {
                db.collection("valuesOfUsers")
                  .where("author", "==", user)
                  .where("ofSession", "==", data.data().currentSession)
                  .get()
                  .then(querySnapshot => {

                    if (querySnapshot.docs[0] && querySnapshot.docs[0].data().value <= 10 && querySnapshot.docs[0].data().value >= -10){

                      const userFactor = querySnapshot.docs[0].data().value;

                      const result = userFactor * chartFactor === -0 ? 0 : userFactor * chartFactor;



                      db.collection("users").doc(user)
                        .get()
                        .then(data => {


                          const currentSession = data.data().currentSession;

                          const resultUntilNow = data.data()[currentSession] ? data.data()[currentSession] : 0;
                          const resultObject = {};

                          const finalResult = Math.round((resultUntilNow + result)*100)/100;
                          resultObject[data.data().currentSession] = finalResult;

                          // console.log(resultObject[data.data().currentSession], data.data().username);

                          db.collection("users").doc(user).update(resultObject);

                        });



                    }


                  })
                    .then(() => {
                      game.enable(user);
                    })
                    .catch(err => console.log(err));
              });

              // end of calculations





        });


    })
    .catch(err => console.log(err));


  });
}


// general ui
joinForm.addEventListener("submit", e => {
  e.preventDefault();

  setUpSession(joinForm.enter.value, 0);
  // game.addUserValue({ id: joinForm.enter.value, value: null });
});


// function which starts session ui

const setUpSession = (id, firstNum) => {

  let enable;

  db.collection("sessions").doc(id).get()
    .then(ses => {
      if (ses.data()){

        if (ses.data().isLive){


          if (id){
            // backend

            db.collection("users").doc(auth.currentUser.uid)
              .get()
              .then(user => {

                if (user.data()[user.data().currentSession]){
                  resultDiv.innerText = `$${user.data()[user.data().currentSession]}`;
                } else {
                  resultDiv.innerText = `$${0}`;
                }

                game.joinGame({ session: id, canAddValues: user.data().canAddValues})
                  .then(() => {








                    join.classList.add("d-none");
                    main.classList.remove("d-none");

                    //setup game
                    localStorage.rangeVal = firstNum;
                    range.value = firstNum;

                    display.innerText = firstNum;
                    if (!auth.currentUser.canAddValue){
                      range.setAttribute("disabled", true);
                    }


                    const resetDisplayStyle = () => {
                      display.classList.remove("btn", "btn-dark", "text-muted");
                      display.classList.add("font-weight-bold");
                    };

                    range.addEventListener("mousedown", () => {
                      display.classList.add("text-muted");
                      display.classList.remove("btn", "btn-dark", "font-weight-bold");
                    });

                    range.addEventListener("input", e => {
                      display.classList.remove("d-none");
                      display.innerText = e.target.value;
                    });

                    range.addEventListener("mouseup", () => {
                      if (localStorage.rangeVal == range.value){
                        resetDisplayStyle();
                      } else {
                        display.classList.remove("text-muted");
                        display.classList.add("btn", "btn-dark");
                      }
                    });

                    enable = () => {
                      range.removeAttribute("disabled");
                    };

                    if (user.data().canAddValues){
                      enable();
                    }

                    display.addEventListener("click", e => {
                      if (e.target.classList.contains("btn")){
                        //range.setAgamettfribute("disabled", true);
                        localStorage.rangeVal = range.value;
                        resetDisplayStyle();


                        game.addUserValue({ id: id, value: range.value });

                      }
                    });

                    // touchscreen
                    range.addEventListener("touchstart", () => {
                      display.classList.add("text-muted");
                      display.classList.remove("btn", "btn-dark", "font-weight-bold");
                    });

                    range.addEventListener("touchend", () => {
                      if (localStorage.rangeVal == range.value){
                        resetDisplayStyle();
                      } else {
                        display.classList.remove("text-muted");
                        display.classList.add("btn", "btn-dark");
                      }
                    });


                  })


              })
              .catch(err => console.log(err));


              let first5 = false;

              //check for updates in user document
              const unsub1 = db.collection("users").doc(auth.currentUser.uid)
                .onSnapshot(querySnapshot => {


                  // check if session ended
                  if (!querySnapshot.data().currentSession && first5){
                    alert("the session has ended");
                    toggleActiveCard(join);
                    setTimeout(unsub1, 1000);
                  }

                  first5 = true;

                  if (first3){
                    // display result

                    resultDiv.innerText = querySnapshot.data()[querySnapshot.data().currentSession] ? `$${querySnapshot.data()[querySnapshot.data().currentSession]}` : `$${0}`;



                    if (querySnapshot.data().canAddValues){
                      enable();
                    } else {
                      range.setAttribute("disabled", true);
                    }


                  }
                  first3 = true;
                })




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

    let first3 = false;




    // scoring

    let first = false;



    db.collection("users").doc(auth.currentUser.uid)
      .onSnapshot(querySnapshot => {


          if (first && querySnapshot.data().canAddValues === true){
            enable();
          }

          first = true;

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
            <label for="name">Type in a nickname:</label>
            <input type="text" class="form-control" id="name" placeholder="nickname">
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
              occupiedAsAdmin: false,
              canAddValues: false
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
