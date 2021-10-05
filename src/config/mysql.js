const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: "fw11bagus",
  password: "Rahasia123!",
  database: "fw11bagus_ticketing",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log("You're now connected db mysql ...");
});

module.exports = connection;
