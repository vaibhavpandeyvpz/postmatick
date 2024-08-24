const axios = require("axios");
const fastify = require("fastify");
const S = require("fluent-json-schema");
const removeMarkdown = require("remove-markdown");

const auth = require("./lib/auth");
const linkedin = require("./lib/linkedin");
const newsapi = require("./lib/newsapi");
const openai = require("./lib/openai");
const config = require("./config");

const app = fastify({
  logger: config.app.env === "development",
});

app.get("/", function handler(req, reply) {
  reply.html();
});

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
  "/news",
  {
    schema: {
      querystring: S.object()
        .prop("q", S.string().required())
        .prop("from", S.string().format(S.FORMATS.DATE)),
    },
  },
  async function handler(req, reply) {
    const everything = await newsapi.everything(req.query.q, req.query.from);
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
  "/post",
  {
    schema: {
      body: S.object()
        .prop("text", S.string().required())
        .prop("media", S.string())
        .prop("visibility", S.enum(["CONNECTIONS", "PUBLIC"]).required()),
    },
  },
  async function handler(req, reply) {
    const { access_token } = req.session.get("linkedin_access_token");
    const userInfo = await auth.userInfo(access_token);
    const { text, visibility } = req.body;
    let media = req.body.media;
    if (
      media &&
      (media.startsWith("http://") || media.startsWith("https://"))
    ) {
      const { image, uploadUrl } = await linkedin.upload(
        access_token,
        userInfo.sub,
      );
      await axios
        .get(media, {
          decompress: false,
          responseType: "arraybuffer",
        })
        .then(({ data }) =>
          axios.post(uploadUrl, data, {
            headers: {
              "content-type": "image/png",
            },
          }),
        );
      media = image;
    }

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

app.get("/status", function handler(req, reply) {
  const token = req.session.get("linkedin_access_token");
  reply.send({
    logged: !!token ? "in" : "out",
  });
});

app.post("/upload", async function handler(req, reply) {
  const { access_token } = req.session.get("linkedin_access_token");
  const userInfo = await auth.userInfo(access_token);
  const result = await linkedin.upload(access_token, userInfo.sub);
  reply.send({
    id: result.image,
    upload_url: result.uploadUrl,
  });
});

app.post(
  "/write",
  {
    schema: {
      body: S.object()
        .prop("url", S.string().format(S.FORMATS.URL).required())
        .prop(
          "image_url",
          S.mixed([S.TYPES.STRING, S.TYPES.NULL]).format(S.FORMATS.URL),
        ),
    },
  },
  async function handler(req, reply) {
    const { url } = req.body;
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
    if (req.body.image_url) {
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
              image_url: { url: req.body.image_url },
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

    reply.send({ text: removeMarkdown(content), image });
  },
);

module.exports = app;
