const { v4: uuidv4 } = require("uuid");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const bookingModel = require("./bookingModel");
const helperWrapper = require("../../helpers/wrapper");
const midtrans = require("../../helpers/midtrans");

module.exports = {
  postBooking: async (req, res) => {
    try {
      // ....
      // console.log(req.body);
      // [1] = UNTUK MENYIMPAN DATA KE DALAM TABLE BOOKING
      // const { userId, scheduleId, seat } = req.body;
      // console.log(seat.length)
      // buat variable object setDataBooking = {...}
      // const result = buat model untuk menginput data booking ke dalam table booking
      // [2] = UNTUK MENYIMPAN DATA KE DALAM TABLE BOOKING SEAT
      // buat proses looping
      // seat.forEach((item) => {
      //   console.log(item);
      //   // bookingId didapat dari result.id
      //   // buat variable object setDataSeat = {...}
      //   // await menjalankan model menginput data bookingSeat ke dalam table bookingSeat
      // });
      // [3] midtrans post
      const id = uuidv4(); // diambil dari hasil proses post booking yang diambil adalah id boking
      const amount = 30000; // total biaya yang harus dibayarkan
      const resultMidtrans = await midtrans.post(id, amount);
      // resultMidtrans = URL REDIRECT MIDTRANS
      return helperWrapper.response(res, 200, "Success post data", {
        ...req.body,
        urlRedirect: resultMidtrans,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  postMidtransNotif: async (req, res) => {
    try {
      // console.log(req.body);
      const result = await midtrans.notif(req.body);
      const {
        order_id: bookingId,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
      } = result;

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          const setData = {
            statusBooking: "failed",
          };
          console.log(bookingId);
          console.log(setData);
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          // [1]
          const setData = {
            statusBooking: "success",
          };
          console.log(bookingId);
          console.log(setData);
          // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI SUKSES
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        // [1]
        const setData = {
          statusBooking: "success",
        };
        console.log(bookingId);
        console.log(setData);
        // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI SUKSES
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        // [1]
        const setData = {
          statusBooking: "failed",
        };
        console.log(bookingId);
        console.log(setData);
        // MENJALANKAN MODEL UNTUK MENGUBAH STATUS BOOKING MENJADI GAGAL
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
      }
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  exportTicket: async (req, res) => {
    try {
      console.log(req.params);
      const { id } = req.params;
      const fileName = `ticket-${id}.pdf`;
      const result = {
        movieName: "Spiderman",
        movieImage:
          "http://localhost:3001/uploads/movie/2021-09-29T06-59-56.645ZAstronaut.jpeg",
      };
      ejs.renderFile(
        path.resolve("./src/templates/pdf/ticket.ejs"),
        { result },
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            const options = {
              height: "11.25in",
              width: "8.5in",
              header: {
                height: "20mm",
              },
              footer: {
                height: "20mm",
              },
            };
            pdf
              .create(result, options)
              .toFile(
                path.resolve(`./public/generate/${fileName}`),
                (error, result) => {
                  console.log(result);
                  if (error) {
                    console.log(error);
                  } else {
                    return helperWrapper.response(
                      res,
                      200,
                      "Success export ticket",
                      {
                        url: `http://localhost:3001/generate/${fileName}`,
                      }
                    );
                    // console.log({
                    //   url: `http://localhost:3001/generate/${fileName}`,
                    // });
                  }
                }
              );
          }
        }
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
};
