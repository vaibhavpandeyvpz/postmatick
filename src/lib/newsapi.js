const axios = require("axios");
const { DateTime } = require("luxon");
const config = require("../config");

function everything(q, from = null, sortBy = "popularity") {
  if (!from) {
    from = DateTime.now().minus({ days: 7 }).toISODate();
  }

  return axios
    .get("https://newsapi.org/v2/everything", {
      params: { q, from, sortBy, apiKey: config.newsapi.key },
    })
    .then(({ data }) => data.articles);
}

module.exports = {
  everything,
};
