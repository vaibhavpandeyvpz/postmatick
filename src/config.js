const config = {
  app: {
    env: process.env.APP_ENV,
    url: process.env.APP_URL,
  },
  freepik: {
    apiKey: process.env.FREEPIK_API_KEY,
  },
  "google-cse": {
    apiKey: process.env.GOOGLE_CSE_API_KEY,
    id: process.env.GOOGLE_CSE_ID,
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
      completion: "gpt-4o-mini",
      image: "dall-e-3",
    },
  },
  host: process.env.HOST || "0.0.0.0",
  port: parseInt(process.env.PORT || "3000"),
  session: {
    cookie: "postmatick",
    expiration: 24 * 60 * 60, // 24 hours
  },
};

module.exports = config;
