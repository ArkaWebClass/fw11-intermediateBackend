const redis = require("redis");

const client = redis.createClient({
  host: "redis-12319.c11.us-east-1-3.ec2.cloud.redislabs.com",
  port: "12319",
  password: "GEA51GAtsTjdNJey64pjItwjiA3OcDYI",
});

client.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("You're now connected db redis ...");
});

module.exports = client;
