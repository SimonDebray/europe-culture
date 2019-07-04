const admin = require('firebase-admin');

let serviceAccount;

if (process.env.GOOGLE_CREDS) {
  serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);
}
else {
  serviceAccount = require('../serviceAccount.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://europe-culture.firebaseio.com",
  storageBucket: 'gs://europe-culture.appspot.com'
});

module.exports = admin;
