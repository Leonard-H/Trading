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
    .catch(err => console.log(err))
  };

  async addValue(data, context){
    db.collection("valuesOfChart").doc(data.index).set({
        ofSession: data.id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        value: data.value
    })
  };

  async stopSession(data, context){
    db.collection("sessions").doc(data.id).update({
      isLive: false
    }).catch(err => console.log(err))
  };
}
