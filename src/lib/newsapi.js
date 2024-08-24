const axios = require("axios");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const { DateTime } = require("luxon");
const Turndown = require("turndown");
const UserAgent = require("user-agents");
const config = require("../config");

const turndown = new Turndown();

function everything(q, from = null, sortBy = "popularity") {
  if (!from) {
    from = DateTime.now().minus({ days: 7 }).toISODate();
  }

  return axios
    .get("https://newsapi.org/v2/everything", {
      params: { q, from, sortBy, apiKey: config.newsapi.apiKey },
    })
    .then(({ data }) => data.articles);
}

function read(url) {
  const headers = { "user-agent": new UserAgent(/Chrome/).toString() };

  return axios
    .get(url, { headers })
    .then(({ data }) => {
      const window = new JSDOM("").window;
      const DOMPurify = createDOMPurify(window);

      return DOMPurify.sanitize(data);
    })
    .then((cleaned) => turndown.turndown(cleaned));
}

module.exports = {
  everything,
  read,
};
