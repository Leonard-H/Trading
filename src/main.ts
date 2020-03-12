import { db, auth } from "./firebase";
console.log(db, auth);
//get references
const start: HTMLDivElement = document.querySelector(".start");
const authDiv: HTMLDivElement = document.querySelector(".auth");
const signup = document.querySelector(".signup");
const login = document.querySelector(".login");

const gameControl: HTMLDivElement = document.querySelector(".game-control");

const range: HTMLInputElement = document.querySelector("input[type=\"range\"]");
const nav = document.querySelector("nav");
const main = document.querySelector(".main");
const resultDiv: HTMLDivElement = document.querySelector(".result");
const account = document.querySelector(".account");
const logout = document.querySelector(".logout-confirmed");
const join: HTMLDivElement = document.querySelector(".join-game");
const joinForm: HTMLFormElement = document.querySelector(".join-form");
const display: HTMLSpanElement = document.querySelector(".display");



// authentication
signup.addEventListener("click", () => {
  authentication.signup();
});

login.addEventListener("click", () => {
  authentication.login();
});



// admin ui

const toggleActiveCard = (card: HTMLDivElement) => {
  Array.from(document.querySelector(".white-cards").children).forEach((child: HTMLDivElement) => {
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

  const initForm: HTMLFormElement = document.querySelector(".init-session");

  let sessionId: string;

  initForm.addEventListener("submit", e => {
    e.preventDefault();

    localStorage.lastChartVal = 0;

    sessionId = initForm.sessionId.value.trim();

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
      const next: HTMLButtonElement = document.querySelector(".next");

      next.onclick = () => {
        setTimeout(() => next.blur(), 50);
        contentDiv.innerHTML = `
          <h1>${sessionId}</h1>
        `;
        next.onclick = gameControlFunction;
      };


    })
    .catch((err: string) => {
      console.log(err);
      alert("There was an error: view console");
    });




  });


  toggleActiveCard(gameControl);
})




const gameControlFunction = () => {


  db.collection("users").doc(auth.currentUser.uid)
    .get()
    .then((data: any) => {

      localStorage.currentSessionOfAdmin = data.data().currentSession;

      db.collection("sessions").doc(localStorage.currentSessionOfAdmin)
        .get()
        .then((session: any) => {
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
            .where("currentSession", "==", localStorage.currentSessionOfAdmin)
            .where("occupiedAsAdmin", "==", false)
            .onSnapshot((querySnapshot: { docs: any[]; }) => {

              querySnapshot.docs.forEach(doc => {
                userList.add(doc.id);
                localStorage.setItem("userList", JSON.stringify(Array.from(userList)));
              });



            });

            // end the session
            const end = document.querySelector(".session-end-confirmed");
            end.addEventListener("click", () => {
              game.endSession({ id:  data.data().currentSession })
                .then(() => {
                  toggleActiveCard(join);
                });
            });


              // block button
              const block = document.querySelector(".block");
              block.addEventListener("click", () => {

              Array.from(userList).forEach((user: string) => {

                  game.disable(user);

                });

              });


            // add a (chart) value
            const addValueForm: HTMLFormElement = document.querySelector(".add-value");
            addValueForm.addEventListener("submit", e => {
              e.preventDefault();


              //calculations
              const chartFactor = Number(addValueForm.value.value.trim()) - Number(localStorage.lastChartVal);

              localStorage.lastChartVal = addValueForm.value.value;
              addValueForm.value.value = "";

              game.updateIndividualResults(userList, chartFactor)
                .then((userValues: object) => {
                  console.table(userValues);
                  game.updateRanking(userValues);
                })
                .catch((err: string) => console.log(err));

        });


    })
    .catch((err: string) => console.log(err));


  });
}


// general ui
joinForm.addEventListener("submit", e => {
  e.preventDefault();

  localStorage.currentSessionOfUser = joinForm.enter.value.trim();
  setUpSession(localStorage.currentSessionOfUser, 0);
});


// function which starts session ui

const setUpSession = (id: string, firstNum: number) => {

  let enable: { (): void; (): void; };

  db.collection("sessions").doc(id).get()
    .then((ses: any) => {
      if (ses.data()){

        if (ses.data().isLive){


          if (id){

            // backend
            db.collection("users").doc(auth.currentUser.uid)
              .get()
              .then((user: any) => {

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
                    range.value = String(firstNum);

                    display.innerText = String(firstNum);
                    if (!user.data().canAddValues){
                      range.setAttribute("disabled", "true");
                    }


                    const resetDisplayStyle = () => {
                      display.classList.remove("btn", "btn-dark", "text-muted");
                      display.classList.add("font-weight-bold");
                    };

                    range.addEventListener("mousedown", () => {
                      display.classList.add("text-muted");
                      display.classList.remove("btn", "btn-dark", "font-weight-bold");
                    });

                    range.addEventListener("input", () => {
                      display.classList.remove("d-none");
                      display.innerText = range.value;
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

                    display.addEventListener("click", () => {
                      if (display.classList.contains("btn")){
                        //range.setAgamettfribute("disabled", true);
                        localStorage.rangeVal = range.value;
                        resetDisplayStyle();

                        game.addUserValue({ id: localStorage.currentSessionOfUser, value: Number(range.value) });

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

                  // get rankigs
                  db.collection("rankings").doc(ses.id)
                    .onSnapshot((querySnapshot: any) => {
                      const rankingsList = document.querySelector(".rankings-list");

                      const keys = Object.keys(querySnapshot.data());
                      const sortedKeys = keys.sort((a, b) => {
                        return querySnapshot.data()[b] - querySnapshot.data()[a];
                      });

                      rankingsList.innerHTML = "";

                      sortedKeys.forEach((key, index) => {
                        const you = key === user.data().username ? "you" : "";

                        rankingsList.innerHTML += `

                            <li class="list-group-item ${you}">

                              <span class="ranking">${index + 1}</span>

                              <div class="info">
                                <p>${key}</p>
                                <small class="text-muted">$${querySnapshot.data()[key]}</small>
                              </div>

                        `;

                      });

                      document.querySelector(".you").scrollIntoView();

                    });


              })
              .catch((err: string) => console.log(err));


              let first5 = false;

              //check for updates in user document
              const unsub1 = db.collection("users").doc(auth.currentUser.uid)
                .onSnapshot((querySnapshot: any) => {


                  // check if session ended
                  if (!querySnapshot.data().currentSession && first5){
                    alert("the session has ended");
                    toggleActiveCard(join);
                    setTimeout(unsub1, 1000);
                  }

                  first5 = true;

                  if (first3){
                    // display result

                    resultDiv.innerText =
                      querySnapshot.data()[querySnapshot.data().currentSession] ?
                      `$${querySnapshot.data()[querySnapshot.data().currentSession]}` :
                      `$${0}`;



                    if (querySnapshot.data().canAddValues){
                      enable();
                    } else {
                      range.setAttribute("disabled", "true");
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


};



//class instances
import "./settings";
import Authentication from "./auth";
const authentication = new Authentication(authDiv);
import Game from "./game";
const game = new Game();

const setUpUser = (user: { getIdTokenResult?: () => Promise<any>; admin: any; email?: any; }) => {

  authentication.addAdminCloudFunction(document.querySelector(".add-admin-form"), () => {
    toggleActiveCard(join)
  });

  db.collection("users").doc(auth.currentUser.uid)
    .get()
    .then((data: any) => {
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


authentication.listener((user: any) => {

  db.collection("users").doc(user.uid)
    .get()
    .then((data: any) => {

      const getName = () => {
        const html = `
        <form class="nameForm">
          <div class="form-group">
            <label for="name">Type in a nickname:</label>
            <input type="text" class="form-control" id="nameInput" placeholder="nickname">
          </div>
          <button type="submit" class="btn btn-dark">Submit</button>
        </form>
        `;

        authDiv.innerHTML = html;
        authDiv.classList.remove("d-none");

        const form: HTMLFormElement = document.querySelector(".nameForm");

        form.addEventListener("submit", e => {
          e.preventDefault();

          db.collection("users").doc(user.uid)
            .set({
              username: form.nameInput.value.trim(),
              currentSession: "",
              occupiedAsAdmin: false,
              canAddValues: false
            })
            .then(() => {
              setUpUser(user);
            })
            .catch((err: string) => console.log(err));

          });
      };



      if (data.data()){
        if (data.data().username){
          setUpUser(user);
        } else {
          getName();
          setUpUser(user);
        }
      } else {
        getName();
        db.collection("users").doc(auth.currentUser.uid).get()
          .then(() => {
            setUpUser(user);
          })
      }
    })
});
