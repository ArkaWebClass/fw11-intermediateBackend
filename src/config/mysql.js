const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "ec2-54-236-24-175.compute-1.amazonaws.com",
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
