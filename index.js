require("dotenv").config();

const app = require("./src/app");
const config = require("./src/config");

app.listen({ port: config.port }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
