const axios = require("axios");
const config = require("../config");

function search(term, page = 1) {
  return axios
    .get("https://api.freepik.com/v1/resources", {
      headers: { "x-freepik-api-key": config.freepik.apiKey },
      params: { term, page, limit: 25 },
    })
    .then(({ data }) =>
      data.data.map((x) => ({
        id: x.id,
        title: x.title,
        formats: Object.keys(x.meta.available_formats || {}),
        preview: x.image.source.url,
        size: x.image.source.size,
      })),
    );
}

function download(id, format = "jpg") {
  return axios
    .get(`https://api.freepik.com/v1/resources/${id}/download/${format}`, {
      headers: { "x-freepik-api-key": config.freepik.apiKey },
    })
    .then(({ data }) => data.data);
}

module.exports = {
  search,
  download,
};
