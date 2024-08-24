require("dotenv").config();
const fs = require("fs");
const path = require("path");
const app = require("./src/app");
const config = require("./src/config");

app.register(require("@fastify/secure-session"), {
  cookieName: config.session.cookie,
  key: fs.readFileSync(path.join(__dirname, "session.key")),
  expiry: config.session.expiration,
  cookie: { path: "/" },
});

app.listen({ port: config.port }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
