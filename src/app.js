const fastify = require("fastify");
const fs = require("fs");
const path = require("path");

const { authorize, finalize } = require("./auth/linkedin");
const config = require("./config");

const app = fastify({
  logger: config.app.env === "development",
});

app.register(require("@fastify/secure-session"), {
  cookieName: config.session.cookie,
  key: fs.readFileSync(path.join(__dirname, "..", "session.key")),
  expiry: config.session.expiration,
  cookie: { path: "/" },
});

app.get("/", function handler(req, reply) {
  const token = req.session.get("linkedin_access_token");
  reply.send({
    hello: "world",
    logged: !!token ? "in" : "out",
  });
});

app.get("/login", async function handler(req, reply) {
  const [url, state] = await authorize();
  req.session.set("openid_linkedin_state", state);
  reply.redirect(url);
});

app.get("/login/callback", async function handler(req, reply) {
  const state = req.session.get("openid_linkedin_state");
  const token = await finalize(req, state);
  req.session.set("linkedin_access_token", token);
  reply.send({ logged: "in" });
});

app.post("/logout", async function handler(req, reply) {
  req.session.delete();
  reply.send({ logged: "out" });
});

module.exports = app;
