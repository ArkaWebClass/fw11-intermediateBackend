const express = require("express");

const Router = express.Router();
const helloRoutes = require("../modules/hello/helloRoutes");
const movieRoutes = require("../modules/movie/movieRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");

// const authRoutes = require(...)
// Router.get("/hello", (request, response) => {
//   response.send("Hello World");
// });
// Router.use("/auth", authRoutes)

Router.use("/hello", helloRoutes);
Router.use("/movie", movieRoutes);
Router.use("/booking", bookingRoutes);

module.exports = Router;
