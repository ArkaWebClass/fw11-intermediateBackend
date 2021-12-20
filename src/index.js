const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const routerNavigation = require("./routes");
// ./routes/index.js
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// const whitelist = ["http://127.0.0.1:5500"];
// const corsOptions = {
//   origin(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(xss());
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public")); // localhost:3001/uploads/movie/namagambar

app.use("/", routerNavigation);

app.use("/*", (request, response) => {
  response.status(404).send("Path not found !");
});

// app.get("/", (request, response) => {
//   response.status(200);
//   response.send("Hello World !");
// });

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express app is listen on port ${port} !, sudah berhasil dijalankan`
  );
});
