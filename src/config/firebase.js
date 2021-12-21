const admin = require("firebase-admin");

const serviceAccount = require("./ticketing-6010a-firebase-adminsdk-n1ouq-30c4c8f710.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
