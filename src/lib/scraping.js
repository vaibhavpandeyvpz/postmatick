const axios = require("axios");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const Turndown = require("turndown");
const UserAgent = require("user-agents");

const turndown = new Turndown();

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
  read,
};
