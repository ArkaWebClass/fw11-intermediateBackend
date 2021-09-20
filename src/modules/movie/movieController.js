const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      const result = await movieModel.getAllMovie();
      // response.status(200).send(result);
      return helperWrapper.response(response, 200, "Success get data", result);
    } catch (error) {
      // response.status(400).send(error.message);
      return helperWrapper.response(
        response,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  postMovie: async (req, res) => {
    try {
      const { name, category, releaseDate, synopsis } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        synopsis,
      };
      const result = await movieModel.postMovie(setData);
      return helperWrapper.response(res, 200, "Success create data", result);
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
