class Game {
  constructor(){

  }
  async newSession(data, context){
    db.collection("sessions").doc(data.id).set({
      isLive: true,
      stock: data.stockName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      creator: data.creator
    })
    .then(data)
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });
    db.collection("users").doc(auth.currentUser.uid).update({
      currentSession: data.id,
      occupatiedAsAdmin: true
    });
  };

  async addValue(data, context){
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

  async endSession(data, context){
    db.collection("sessions").doc(data.id).update({
      isLive: false
    })
    .catch(err => {
      console.log(err);
      alert("There was an error: view console");
    });
  };
}
