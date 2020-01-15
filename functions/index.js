const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  //check if function is carried out by an admin
  if (context.auth.token.admin !== true){
    return { error: "only admins do this; you can't hack me!" }
  } else {
    // get user and add admin custom claim
    return admin.auth().getUserByEmail(data.email).then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      })
    }).then(() => {
      return {
        message: `Success! ${data.email} has been made an admin.`
      }
    }).catch(err => {
      return err;
    });
  }
});

// exports.disable = functions.https.onCall((data, context) => {
//
//   if (context.auth.token.admin !== true){
//     return {error: "only admins can du this; yout can't hack me!"}
//   } else {
//     // set custom claim
//     return admin.auth().setCustomUserClaims(data.uid, {
//       canAddValue: true
//     })
//       .then(() => {
//         return { message: "success" }
//       })
//   }
//
// });
//
// exports.enable = functions.https.onCall((data, context) => {
//   //check if function is carried out by an admin
//   if (context.auth.token.admin !== true){
//     return { error: "only admins do this; you can't hack me!" }
//   } else {
//     // set custom claim
//     return admin.auth().setCustomUserClaims(user.uid, {
//       canAddValue: true
//     })
//       .then(() => {
//         return { message: "success" }
//       })
//
//   }
// });
