const config = {
  app: {
    env: process.env.APP_ENV,
    url: process.env.APP_URL,
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    scopes: (process.env.LINKEDIN_SCOPES || "").split(","),
    version: "202408",
  },
  newsapi: {
    apiKey: process.env.NEWSAPI_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    models: {
      completion: "gpt-4o",
      image: "dall-e-3",
    },
  },
  port: parseInt(process.env.PORT),
  session: {
    cookie: "postmatick",
    expiration: 24 * 60 * 60, // 24 hours
  },
};

module.exports = config;
