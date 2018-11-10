import hiddenKey from './api';
// import firebase from 'firebase';
//
// let config = {
//   apiKey: hiddenKey,
//   authDomain: "emersonchores.firebaseapp.com",
//   projectId: "emersonchores"
// };
//
// export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

const firebase = require('firebase/app');
require("firebase/firestore");
firebase.initializeApp({
  apiKey: hiddenKey,
  authDomain: "emersonchores.firebaseapp.com",
  projectId: "emersonchores"
});
const db = firebase.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings);
export default db;
