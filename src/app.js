const axios = require("axios");
const fastify = require("fastify");
const S = require("fluent-json-schema");
const removeMarkdown = require("remove-markdown");

const auth = require("./lib/auth");
const freepik = require("./lib/freepik");
const gcs = require("./lib/google-custom-search");
const linkedin = require("./lib/linkedin");
const newsapi = require("./lib/newsapi");
const openai = require("./lib/openai");
const scraping = require("./lib/scraping");
const wordpress = require("./lib/wordpress");
const config = require("./config");

const app = fastify({
  logger: config.app.env === "development",
});

app.get("/", function handler(req, reply) {
  reply.html();
});

app.post(
  "/draw",
  {
    schema: {
      body: S.object()
        .prop("contentType", S.enum(["LINKEDIN", "WORDPRESS"]).required())
        .prop("content", S.string().required())
        .prop("prompt", S.string()),
    },
  },
  async function handler(req, reply) {
    const { contentType, content, prompt } = req.body;

    const image = await openai.draw(
      prompt,
      contentType === "LINKEDIN" ? "1024x1024" : "1792x1024",
    );

    reply.send({ image });
  },
);

app.post(
  "/idea",
  {
    schema: {
      body: S.object()
        .prop("contentType", S.enum(["LINKEDIN", "WORDPRESS"]).required())
        .prop("content", S.string().required()),
    },
  },
  async function handler(req, reply) {
    const { contentType, content } = req.body;
    const prompt = await openai.complete([
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Create a prompt for DALL-E 3 to generate a relevant image for posting along the following content.
            It should look like a realistic photograph, shot from a professional 4K camera.
            Just respond with prompt as plain text, no metadata, sections or headings etc.`,
          },
          { type: "text", text: content },
        ],
      },
    ]);

    reply.send({ prompt });
  },
);

app.get(
  "/images",
  {
    schema: {
      querystring: S.object().prop("q", S.string().required()),
    },
  },
  async function handler(req, reply) {
    const { q } = req.query;
    const images = await freepik.search(q);

    reply.send({ images });
  },
);

app.get(
  "/images/:id",
  {
    schema: {
      params: S.object().prop("id", S.integer().required()),
    },
  },
  async function handler(req, reply) {
    const { id } = req.params;
    const [image] = await freepik.download(id);

    reply.send({ image });
  },
);

app.get("/login", async function handler(req, reply) {
  const [url, state] = await auth.authorize();
  req.session.set("openid_linkedin_state", state);
  reply.redirect(url);
});

app.get("/login/callback", async function handler(req, reply) {
  const state = req.session.get("openid_linkedin_state");
  const token = await auth.finalize(req, state);
  req.session.set("linkedin_access_token", token);
  reply.redirect("/");
});

app.post("/logout", async function handler(req, reply) {
  req.session.delete();
  reply.send({ logged: "out" });
});

app.get("/me", async function handler(req, reply) {
  const { access_token } = req.session.get("linkedin_access_token");
  const user = await auth.userInfo(access_token);
  reply.send({ user });
});

app.get(
  "/search",
  {
    schema: {
      querystring: S.object()
        .prop("provider", S.enum(["GOOGLE", "NEWSAPI"]).required())
        .prop("q", S.string().required()),
    },
  },
  async function handler(req, reply) {
    const { provider, q } = req.query;
    const results =
      provider === "GOOGLE" ? await gcs.search(q) : await newsapi.everything(q);

    reply.send({ results });
  },
);

app.post(
  "/post",
  {
    schema: {
      body: S.object()
        .prop("contentType", S.enum(["LINKEDIN", "WORDPRESS"]).required())
        .prop("title", S.string())
        .prop("content", S.string().required())
        .prop("image", S.string()),
    },
  },
  async function handler(req, reply) {
    const { contentType, title, content, image, visibility } = req.body;

    if (contentType === "LINKEDIN") {
      const { access_token } = req.session.get("linkedin_access_token");
      const userInfo = await auth.userInfo(access_token);
      const { createdEntityId } = await linkedin.post(
        access_token,
        userInfo.sub,
        removeMarkdown(content),
        image,
        visibility,
      );
      reply.send({ id: createdEntityId });
      return;
    }

    if (contentType === "WORDPRESS") {
      const { id } = await wordpress.post(title, content, image);
      reply.send({ id });
      return;
    }

    return reply.send({ success: false });
  },
);

app.get("/status", function handler(req, reply) {
  const token = req.session.get("linkedin_access_token");
  reply.send({
    logged: !!token ? "in" : "out",
  });
});

app.post(
  "/write",
  {
    schema: {
      body: S.object()
        .prop("url", S.string().format(S.FORMATS.URL).required())
        .prop("prompt", S.string()),
    },
  },
  async function handler(req, reply) {
    const { url, prompt } = req.body;
    const article = await scraping.read(url);
    const content = await openai.complete([
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          { type: "text", text: article },
        ],
      },
    ]);

    reply.send({ content });
  },
);

module.exports = app;
