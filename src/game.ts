import { firebase, db, auth } from "./firebase";

class Game {
  constructor(){

  }

  // admin
  async newSession(data: { id: any; stockName: any; }){
    db.collection("sessions").doc(data.id).set({
      isLive: true,
      stock: data.stockName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      creator: auth.currentUser.uid
    })
    .catch((err: string) => {
      console.log(err);
      alert("There was an error: view console");
    });
    db.collection("users").doc(auth.currentUser.uid).update({
      currentSession: data.id,
      occupiedAsAdmin: true
    });
    db.collection("rankings").doc(data.id).set({});
  };



  async endSession(data: { id: any; }){
    db.collection("rankings").doc(data.id)
      .get()
      .then((rank: any) => {
        const keys = Object.keys(rank.data());
        const sortedKeys = keys.sort((a, b) => {
          return rank.data()[b] - rank.data()[a];
        });
        db.collection("sessions").doc(data.id).update({
          isLive: false,
          winner: sortedKeys[0]
        })
        .catch((err: string) => {
          console.log(err);
          alert("There was an error: view console");
        });

      })

    db.collection("users")
      .where("currentSession", "==", data.id)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          db.collection("users").doc(doc.id)
            .update({
              currentSession: "",
              canAddValues: false
            });
          });
      })
      .catch((err: string) => {
        console.log(err);
        alert("There was an error: view console");
      });

    db.collection("users").doc(auth.currentUser.uid).update({
      occupiedAsAdmin: false
    })
    .catch((err: string) => {
      console.log(err);
      alert("There was an error: view console");
    });


  };

  async updateIndividualResults(userList: any, chartFactor: number){

    let userValues = {};

    return new Promise((resolve) => {


      Array.from(userList).forEach((user: string) => {

        db.collection("users").doc(user).update({
          canAddValues: true
        })
          .then(() => console.log("successfully updated user: " + user))
          .catch((err: string) => console.log(err));

       db.collection("valuesOfUsers")
         .where("author", "==", user)
         .where("ofSession", "==", localStorage.currentSessionOfAdmin)
         .get()
         .then((querySnapshot: any) => {


           if (querySnapshot.docs[0] && querySnapshot.docs[0].data().value <= 10 && querySnapshot.docs[0].data().value >= -10){
             const userFactor = querySnapshot.docs[0].data().value;

             const result = userFactor * chartFactor === -0 ? 0 : userFactor * chartFactor;

             // function for calculations
             const calculateResult = (userData: { data: () => { (): any; new(): any;[x: string]: any; currentSession: any; }; }) => {

               const currentSession = userData.data().currentSession;

               const resultUntilNow = userData.data()[currentSession] ? userData.data()[currentSession] : 0;

               return resultUntilNow + result;

             };

             db.collection("users").doc(user)
               .get()
               .then((userData: { data: any; id?: any; }) => {

                 const finalResult = calculateResult(userData);

                 const resultObject = {
                   [userData.data().currentSession]: finalResult
                 };

                 db.collection("users").doc(userData.id).update(resultObject)
                 .then(() => console.group("done"))
                  .catch((err: string) => console.log(err));


                 userValues[userData.data().username] = finalResult;

                 // return userValues for rankings if userValues are complete
                 if (Object.keys(userValues).length === [...userList].length)
                   resolve(userValues);

               });


           }

         })
           .catch((err: string) => console.log(err));

     });

    });

  };


  async updateRanking(data: any){
    db.collection("rankings").doc(localStorage.currentSessionOfAdmin).update(data);
  };


  // genereal

  async joinGame(data: { canAddValues: any; session: any; }){

    if (data.canAddValues){
      db.collection("users").doc(auth.currentUser.uid).update({
        currentSession: data.session,
        occupiedAsAdmin: false,
      })
      .catch((err: string) => {
        console.log(err);
        alert("There was an error: view console");
      });
    } else {
      db.collection("users").doc(auth.currentUser.uid).update({
        currentSession: data.session,
        occupiedAsAdmin: false,
        canAddValues: false
      })
      .catch((err: string) => {
        console.log(err);
        alert("There was an error: view console");
      });
    }

  }

  async addUserValue(data: { id: any; value: number; }){
    // data.value, data.id
    console.log(data.id);

    if (data.value < -11 || data.value > 11){
      alert("Please make sure that the value you set is between -10 and 10.");
      console.log(data.value);
    } else {

      db.collection("valuesOfUsers")
        .where("ofSession", "==", data.id)
        .where("author", "==", auth.currentUser.uid)
        .get()
        .then((querySnapshot: { docs: { id: any; }[]; }) => {

          if (querySnapshot.docs[0]){


            db.collection("valuesOfUsers").doc(querySnapshot.docs[0].id).update({
              ofSession: data.id,
              value: data.value
            });

          } else {

            console.log("justJoined");

            db.collection("valuesOfUsers").add({
              ofSession: data.id,
              value: data.value,
              author: auth.currentUser.uid
            })
            .catch((err: string) => console.log(err));
          }


        })
        .catch((err: string) => console.log(err));

    }

  }


  async createStockValueIdsArray(querySnapshot: { docs: any[]; }, callback: (arg0: any[]) => void){


    let stockValueIds = [];

    querySnapshot.docs.forEach(doc => {

      stockValueIds.push({
        value: doc.data().value,
        // time1: Number(String(data.data().timestamp.seconds) + String(data.data().timestamp.nanoseconds)),
        // time: doc.data().timestamp.toDate().getTime()
      });
    });

    callback(stockValueIds);
  }

  async disable(id: string){
    // const disable = functions.httpsCallable('disable');
    // disable({ uid: id })
    db.collection("users").doc(id).update({
      canAddValues: false
    });
  }
}

export default Game;
