const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = Number(page);
      limit = Number(limit);
      // TAMBAHKAN PROSES PEMBERIAN NILAI DEFAULT VALUE
      // PAGE = 1
      // LIMIT = 10
      // SORT = "id ASC"
      // SEARCH = ""
      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie();
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page, // page: page
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(limit, offset);

      return helperWrapper.response(
        response,
        200,
        "Success get data",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getMovieById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }
      return helperWrapper.response(res, 200, "Success get data by id", result);
    } catch (error) {
      return helperWrapper.response(
        res,
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
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }
      const { name, category, releaseDate, synopsis } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        synopsis,
        updatedAt: new Date(Date.now()),
      };

      for (const data in setData) {
        // looping object yang ada di setData
        if (!setData[data]) {
          // untuk pengecekan apakah value didalam property ada isinya atau tidak
          delete setData[data]; // delete property yang ada di dalam setData
        }
      }
      // https://stackoverflow.com/questions/43807515/eslint-doesnt-allow-for-in

      const result = await movieModel.updateMovie(setData, id);
      return helperWrapper.response(res, 200, "Success update data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }
      // PROSES DELETE
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
