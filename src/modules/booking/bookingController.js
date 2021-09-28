const bookingModel = require("./bookingModel");
const helperWrapper = require("../../helpers/wrapper");
const { setMaxListeners } = require("../../config/mysql");

module.exports = {
  postBooking: async (req, res) => {
    try {
      // ....
      console.log(req.body);
      // [1] = UNTUK MENYIMPAN DATA KE DALAM TABLE BOOKING
      const { userId, scheduleId, seat } = req.body;
      // console.log(seat.length)
      // buat variable object setDataBooking = {...}
      // const result = buat model untuk menginput data booking ke dalam table booking

      // [2] = UNTUK MENYIMPAN DATA KE DALAM TABLE BOOKING SEAT
      // buat proses looping
      seat.forEach((item) => {
        console.log(item);
        // bookingId didapat dari result.id
        // buat variable object setDataSeat = {...}
        // await menjalankan model menginput data bookingSeat ke dalam table bookingSeat
      });
      return helperWrapper.response(res, 200, "Success post data", req.body);
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
