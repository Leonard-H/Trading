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
    console.log(data.value);

    db.collection("valuesOfUsers").add({
      ofSession: data.id,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      value: data.value,
      author: auth.currentUser.uid
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });


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
