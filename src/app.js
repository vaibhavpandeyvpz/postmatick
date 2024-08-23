const fastify = require("fastify")({
  logger: process.env.NODE_ENV === "development",
});

fastify.get("/", function handler(request, reply) {
  reply.send({ hello: "world" });
});

module.exports = fastify;
