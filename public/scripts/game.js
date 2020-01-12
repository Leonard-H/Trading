class Game {
  constructor(){

  }

  // admin
  async newSession(data){
    db.collection("sessions").doc(data.id).set({
      isLive: true,
      stock: data.stockName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      creator: data.creator
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });
    db.collection("users").doc(auth.currentUser.uid).update({
      currentSession: data.id,
      occupiedAsAdmin: true
    });
  };

  async addValue(data){
    db.collection("valuesOfChart").add({
        ofSession: data.id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        value: data.value
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });
  };

  async endSession(data){
    db.collection("sessions").doc(data.id).update({
      isLive: false
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });

    db.collection("users")
      .where("currentSession", "==", data.id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          db.collection("users").doc(doc.id)
            .update({
              currentSession: ""
            });
          });
      })
      .catch(err => {
        console.log(err);
        alert("There was an error: view console");
      });

    db.collection("users").doc(auth.currentUser.uid).update({
      occupiedAsAdmin: false
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });


  };


  // genereal

  async joinGame(data){

    db.collection("users").doc(auth.currentUser.uid).update({
      currentSession: data.session,
      occupiedAsAdmin: false
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });


  }

  async addUserValue(data){
    db.collection("valuesOfUsers").add({
      ofSession: data.id,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      value: data.value
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });

  }


  async createStockValueIdsArray(querySnapshot){

    let stockValueIds = [];

    return new Promise((resolve, reject) => {

      querySnapshot.docs.forEach(doc => {

        db.collection("valuesOfChart").doc(doc.id)
          .get()
          .then(data => {
             stockValueIds.push({
               value: data.data().value,
               // time1: Number(String(data.data().timestamp.seconds) + String(data.data().timestamp.nanoseconds)),
               time: data.data().timestamp.toDate().getTime()
             });
          });

      })

      resolve(stockValueIds);

    });
  }


  async getScore(data){
    /*  data must contain:
    *   session id as "id"
    *   player id as "user"
    */









  }

}
