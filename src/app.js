const fastify = require("fastify");
const S = require("fluent-json-schema");
const fs = require("fs");
const path = require("path");
const removeMarkdown = require("remove-markdown");

const auth = require("./lib/auth");
const linkedin = require("./lib/linkedin");
const newsapi = require("./lib/newsapi");
const openai = require("./lib/openai");
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

app.get("/", function handler(request, reply) {
  const token = request.session.get("linkedin_access_token");
  reply.send({
    hello: "world",
    logged: !!token ? "in" : "out",
  });
});

app.get("/me", async function handler(request, reply) {
  const { access_token } = request.session.get("linkedin_access_token");
  const user = await auth.userInfo(access_token);
  reply.send({ user });
});

app.get(
  "/news",
  {
    schema: {
      querystring: S.object()
        .prop("q", S.string().required())
        .prop("from", S.string().format(S.FORMATS.DATE)),
    },
  },
  async function handler(request, reply) {
    const everything = await newsapi.everything(
      request.query.q,
      request.query.from,
    );
    const articles = everything
      .filter((x) => x.content !== "[Removed]")
      .map((x) => ({
        image: x.urlToImage,
        title: x.title,
        description: x.description,
        url: x.url,
        source: x.source.name,
        author: x.author,
        ts: x.publishedAt,
      }));

    reply.send({ articles });
  },
);

app.post(
  "/write",
  {
    schema: {
      querystring: S.object()
        .prop("url", S.string().format(S.FORMATS.URL).required())
        .prop("image_url", S.string().format(S.FORMATS.URL)),
    },
  },
  async function handler(request, reply) {
    const { url } = request.query;
    const article = await newsapi.read(url);
    const content = await openai.complete([
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create short content for a LinkedIn post based on the following content from an online article.",
          },
          { type: "text", text: article },
        ],
      },
    ]);
    let hashtags = content.match(/#\w+/g);
    if (request.query.image_url) {
      const description = await openai.complete([
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract and represent whatever is in the image as popular hashtags.",
            },
            {
              type: "image_url",
              image_url: { url: request.query.image_url },
            },
          ],
        },
      ]);
      const tags = description.match(/#\w+/g);

      hashtags = [...hashtags, ...tags];
    }

    const image = await openai.draw(
      "Generate image for a Linkedin post based on following hashtags: " +
        hashtags.join(" "),
    );

    reply.send({ written: removeMarkdown(content), image });
  },
);

app.post(
  "/post",
  {
    schema: {
      body: S.object()
        .prop("text", S.string().required())
        .prop("media", S.string())
        .prop("visibility", S.enum(["CONNECTIONS", "PUBLIC"]).required()),
    },
  },
  async function handler(request, reply) {
    const { access_token } = request.session.get("linkedin_access_token");
    const userInfo = await auth.userInfo(access_token);
    const { text, media, visibility } = request.body;
    const { createdEntityId } = await linkedin.post(
      access_token,
      userInfo.sub,
      text,
      media,
      visibility,
    );
    reply.send({ id: createdEntityId });
  },
);

app.get("/login", async function handler(request, reply) {
  const [url, state] = await auth.authorize();
  request.session.set("openid_linkedin_state", state);
  reply.redirect(url);
});

app.get("/login/callback", async function handler(request, reply) {
  const state = request.session.get("openid_linkedin_state");
  const token = await auth.finalize(request, state);
  request.session.set("linkedin_access_token", token);
  reply.send({ logged: "in" });
});

app.post("/logout", async function handler(request, reply) {
  request.session.delete();
  reply.send({ logged: "out" });
});

app.post("/upload", async function handler(request, reply) {
  const { access_token } = request.session.get("linkedin_access_token");
  const userInfo = await auth.userInfo(access_token);
  const result = await linkedin.upload(access_token, userInfo.sub);
  reply.send({
    id: result.image,
    upload_url: result.uploadUrl,
  });
});

module.exports = app;
