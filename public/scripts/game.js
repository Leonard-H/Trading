class Game {
  constructor(){

  }

  // admin
  async newSession(data){
    db.collection("sessions").doc(data.id).set({
      isLive: true,
      stock: data.stockName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      creator: auth.currentUser.uid
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

    if (data.canAddValues){
      db.collection("users").doc(auth.currentUser.uid).update({
        currentSession: data.session,
        occupiedAsAdmin: false,
      })
      .catch(err => {
        console.log(err);
        alert("There was an error: view console");
      });
    } else {
      db.collection("users").doc(auth.currentUser.uid).update({
        currentSession: data.session,
        occupiedAsAdmin: false,
        canAddValues: false
      })
      .catch(err => {
        console.log(err);
        alert("There was an error: view console");
      });
    }

  }

  async addUserValue(data){

    if (data.value < -11 || data.value > 11){
      alert("Please make sure that the value you set is between -10 and 10.");
      console.log(data.value);
    } else {

      db.collection("valuesOfUsers")
        .where("ofSession", "==", data.id)
        .where("author", "==", auth.currentUser.uid)
        .get()
        .then(querySnapshot => {

          if (querySnapshot.docs[0]){


            db.collection("valuesOfUsers").doc(querySnapshot.docs[0].id).update({
              ofSession: data.id,
              value: data.value
            });

          } else {

            db.collection("valuesOfUsers").add({
              ofSession: data.id,
              value: data.value,
              author: auth.currentUser.uid
            })
            .catch(err => console.log(err));
          }


        })
        .catch(err => console.log(err));

    }

  }


  async createStockValueIdsArray(querySnapshot, callback){


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

async disable(id){
  // const disable = functions.httpsCallable('disable');
  // disable({ uid: id })
  db.collection("users").doc(id).update({
    canAddValues: false
  });
}

async enable(id){
  // const enable = functions.httpsCallable('enable');
  // enable({ uid: id })
  db.collection("users").doc(id).update({
    canAddValues: true
  });
}





}
