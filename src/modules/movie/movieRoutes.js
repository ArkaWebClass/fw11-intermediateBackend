const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");

Router.get("/", movieController.getAllMovie);
Router.post("/", movieController.postMovie);

module.exports = Router;
