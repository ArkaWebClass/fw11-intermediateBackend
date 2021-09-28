const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");

Router.get("/", middlewareRedis.getMovieRedis, movieController.getAllMovie);
// =======
Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
// =======
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  movieController.postMovie
);
Router.patch(
  "/:id",
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
);
Router.delete(
  "/:id",
  middlewareRedis.clearMovieRedis,
  movieController.deleteMovie
);

module.exports = Router;
