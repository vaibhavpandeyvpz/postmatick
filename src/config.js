const config = {
  app: {
    env: process.env.APP_ENV,
    url: process.env.APP_URL,
  },
  linkedin: {
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    scopes: (process.env.LINKEDIN_SCOPES || "").split(","),
    version: "202408",
  },
  newsapi: {
    key: process.env.NEWSAPI_KEY,
  },
  port: parseInt(process.env.PORT),
  session: {
    cookie: "postmatick",
    expiration: 24 * 60 * 60, // 24 hours
  },
};

module.exports = config;
