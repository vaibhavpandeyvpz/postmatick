require("dotenv").config();

const freepik = require("./src/lib/freepik");
const gcs = require("./src/lib/google-custom-search");
const newsapi = require("./src/lib/newsapi");

// freepik.download(134112585).then((result) => {
//   console.log(JSON.stringify(result, null, 2));
// });

// freepik.search("website").then((result) => {
//   console.log(JSON.stringify(result, null, 2));
// });

// gcs.search("scrape google maps contacts").then((result) => {
//   console.log(JSON.stringify(result, null, 2));
// });

newsapi.everything("artificial intel").then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
