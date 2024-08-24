require("dotenv").config();
const fs = require("fs");
const path = require("path");
const app = require("./src/app");
const config = require("./src/config");

(async function main() {
  await app.register(require("@fastify/secure-session"), {
    cookieName: config.session.cookie,
    key: fs.readFileSync(path.join(__dirname, "session.key")),
    expiry: config.session.expiration,
    cookie: { path: "/" },
  });

  await app.register(require("@fastify/vite"), {
    root: __dirname,
    dev: config.app.env === "development",
    spa: true,
  });

  await app.vite.ready();

  app.listen({ port: config.port }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
})();
