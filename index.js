require("dotenv").config();
const app = require("./src/app");

const port = process.env.PORT || 3000;

app.listen({ port }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
