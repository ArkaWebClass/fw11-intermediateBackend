const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
  host: process.env.RDS_HOST,
  port: process.env.RDS_PORT,
  password: process.env.RDS_PASSWORD,
});

client.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("You're now connected db redis ...");
});

module.exports = client;
