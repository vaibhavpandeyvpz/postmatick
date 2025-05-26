const { customsearch } = require("@googleapis/customsearch");
const config = require("../config");

const cs = customsearch("v1");

function search(q) {
  return cs.cse
    .list({ cx: config["google-cse"].id, q, auth: config["google-cse"].apiKey })
    .then(({ data }) =>
      data.items.map((x) => ({
        title: x.title,
        description: x.snippet,
        image: x.image?.thumbnailLink,
        url: x.link,
      })),
    );
}

module.exports = {
  search,
};
