const midtransClient = require("midtrans-client");
require("dotenv").config();

const snap = new midtransClient.Snap({
  isProduction: process.env.MT_PRODUCTION === "true",
  serverKey: process.env.MT_SERVER_KEY,
  clientKey: process.env.MT_SERVER_KEY,
});

module.exports = {
  post: (id, amount) =>
    new Promise((resolve, reject) => {
      console.log("POST MIDTRANS RUN");
      // Create Snap API instance
      const parameter = {
        transaction_details: {
          order_id: id,
          gross_amount: amount,
        },
        credit_card: {
          secure: true,
        },
      };
      snap
        .createTransaction(parameter)
        .then((result) => {
          // console.log(result);
          resolve(result.redirect_url);
        })
        .catch((error) => {
          // console.log(error);
          reject(error);
        });
    }),
  notif: (body) =>
    new Promise((resolve, reject) => {
      console.log("NOTIF MIDTRANS RUN");
      snap.transaction
        .notification(body)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
