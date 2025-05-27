const axios = require("axios");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const sharp = require("sharp");
const { Converter } = require("showdown");
const WPAPI = require("wpapi");
const config = require("../config");

const wp = new WPAPI({
  endpoint: config.wordpress.endpoint,
  username: config.wordpress.username,
  password: config.wordpress.password,
});

async function post(
  title,
  content,
  image,
  status = "draft" /* or "publish" */,
) {
  content = new Converter().makeHtml(content);

  const { data: original } = await axios.get(image, {
    decompress: false,
    responseType: "arraybuffer",
  });

  const resized = await sharp(original)
    .resize(1920, 1080, { fit: "inside" })
    .toBuffer();

  const compressed = await imagemin.buffer(resized, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.5, 0.75],
      }),
    ],
  });

  const url = new URL(image);
  const filename = url.pathname.split("/").reverse()[0];

  const media = await wp.media().file(compressed, filename).create();
  const post = await wp.posts().create({ title, content, status });

  await wp.media().id(media.id).update({ post: post.id });
  await wp.posts().id(post.id).update({ featured_media: media.id });

  return post;
}

module.exports = {
  post,
};
