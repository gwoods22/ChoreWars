import hiddenKey from './api';
import * as firebase from 'firebase';

let config = {
  apiKey: hiddenKey,
  authDomain: "emersonchores.firebaseapp.com",
  projectId: "emersonchores"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();