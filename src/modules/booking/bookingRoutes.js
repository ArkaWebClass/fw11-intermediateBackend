const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.post("/", bookingController.postBooking);
Router.post("/midtrans-notification", bookingController.postMidtransNotif);
Router.get("/ticket/:id", bookingController.exportTicket);

module.exports = Router;
