const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");
const redis = require("../../config/redis");
const deleteFile = require("../../helpers/uploads/deleteFile");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      // console.log(req.decodeToken);
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

      redis.setex(
        `getMovie:${JSON.stringify(request.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

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

      // PROSES UNTUK MENYIMPAN DATA KE DALAM REDIS
      // =====
      redis.setex(`getMovie:${id}`, 3600, JSON.stringify(result));
      // ======
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
      // req.file = {
      //   fieldname: 'image',
      //   originalname: 'Astronaut.jpeg',
      //   encoding: '7bit',
      //   mimetype: 'image/jpeg',
      //   destination: 'public/uploads/movie',
      //   filename: '2021-09-29T07-13-43.982ZAstronaut.jpeg',
      //   path: 'public/uploads/movie/2021-09-29T07-13-43.982ZAstronaut.jpeg',
      //   size: 16664
      // }
      const { name, category, releaseDate, synopsis } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        synopsis,
        image: req.file ? req.file.filename : null,
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

      // for (const data in setData) {
      //   // looping object yang ada di setData
      //   if (!setData[data]) {
      //     // untuk pengecekan apakah value didalam property ada isinya atau tidak
      //     delete setData[data]; // delete property yang ada di dalam setData
      //   }
      // }
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
      // const result =  await deleteMovie...
      deleteFile(`public/uploads/movie/${checkId[0].image}`);
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
