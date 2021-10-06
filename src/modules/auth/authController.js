const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helpers/wrapper");
const modelAuth = require("./authModel");
const redis = require("../../config/redis");
const sendMail = require("../../helpers/email");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      // PROSES PENGECEKAN EMAIL SUDAH PERNAH TERDAFTAR ATAU BLM DI DATABASE
      // PROSES ENCRYPT PASSWORD

      const setData = {
        id: uuidv4(),
        email,
        password,
      };
      const setDataEmail = {
        to: email, // req.body / bagustri15@gmail.com
        subject: "Email Verification !",
        template: "email-verification",
        data: {
          firstname: "Bagus TH",
        },
        // attachment: [
        //   {
        //     filename: "movie1.jpg",
        //     path: "./public/uploads/movie/2021-09-29T06-59-56.645ZAstronaut.jpeg",
        //   },
        // ],
      };
      await sendMail(setDataEmail);
      const result = await modelAuth.register(setData);
      return helperWrapper.response(res, 200, "Success register user", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await modelAuth.getUserByEmail(email);

      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not registed", null);
      }

      if (password !== checkUser[0].password) {
        return helperWrapper.response(res, 400, "Wrong password", null);
      }

      // PROSES UTAMA MEMBUAT TOKEN MENGGUNAKAN JWT (DATA YANG MAU DIUBAH, KATA KUNCI, LAMA TOKEN BISA DIGUNAKAN )
      const payload = checkUser[0];
      delete payload.password;
      const token = jwt.sign({ ...payload }, "RAHASIA", {
        expiresIn: "1h",
      });
      // ADD REFRESH TOKEN
      const refreshToken = jwt.sign({ ...payload }, "RAHASIA", {
        expiresIn: "24h",
      });
      return helperWrapper.response(res, 200, "Success login", {
        id: payload.id,
        token,
        refreshToken,
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
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      redis.setex(`accessToken:${token}`, 3600 * 24, token);
      return helperWrapper.response(res, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  refreshToken: async (req, res) => {
    try {
      // console.log(req.body);
      const { refreshToken } = req.body;
      // PROSES PENGECEKAN REFRESH TOKEN APAKAH BISA DIGUNAKAN ATAU TIDAK
      redis.get(`refreshToken:${refreshToken}`, (error, result) => {
        if (!error && result !== null) {
          return helperWrapper.response(
            res,
            403,
            "Your refresh token cannot be use"
          );
        }
        jwt.verify(refreshToken, "RAHASIA", (error, result) => {
          if (error) {
            return helperWrapper.response(res, 403, error.message);
          }
          delete result.iat;
          delete result.exp;
          const token = jwt.sign(result, "RAHASIA", {
            expiresIn: "1h",
          });
          const newRefreshToken = jwt.sign(result, "RAHASIA", {
            expiresIn: "24h",
          });
          redis.setex(`refreshToken:${refreshToken}`, 3600 * 24, refreshToken);
          return helperWrapper.response(res, 200, "Success Refresh Token !", {
            id: result.id,
            token,
            refreshToken: newRefreshToken,
          });
        });
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
};
