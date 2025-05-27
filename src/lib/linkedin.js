const axios = require("axios");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const { RestliClient } = require("linkedin-api-client");
const sharp = require("sharp");
const config = require("../config");

const client = new RestliClient();

/**
 * @param {String} accessToken
 * @param {String} userId
 * @param {String} text
 * @param {String | null} media
 * @param {'CONNECTIONS' | 'LOGGED_IN' | 'PUBLIC'} visibility
 * @param {Boolean} draft
 * @param {Boolean} distribute
 * @param {Boolean} sharing
 * @returns {Object}
 */
async function post(
  accessToken,
  userId,
  text = "",
  media = null,
  visibility = "PUBLIC",
  draft = false,
  distribute = true,
  sharing = true,
) {
  if (media) {
    const { image: uploadedMedia, uploadUrl } = await upload(
      accessToken,
      userId,
    );
    await axios
      .get(media, {
        decompress: false,
        responseType: "arraybuffer",
      })
      .then(({ data }) =>
        sharp(data).resize(1024, 1024, { fit: "inside" }).toBuffer(),
      )
      .then((resized) =>
        imagemin.buffer(resized, {
          plugins: [
            imageminJpegtran(),
            imageminPngquant({
              quality: [0.5, 0.75],
            }),
          ],
        }),
      )
      .then((compressed) =>
        axios.post(uploadUrl, compressed, {
          headers: {
            "content-type": media.endsWith(".png") ? "image/png" : "image/jpeg",
          },
        }),
      );
    media = uploadedMedia;
  }

  return client.create({
    accessToken,
    entity: {
      author: `urn:li:person:${userId}`,
      commentary: text,
      visibility,
      distribution: {
        feedDistribution: distribute ? "MAIN_FEED" : "NONE",
      },
      lifecycleState: draft ? "DRAFT" : "PUBLISHED",
      isReshareDisabledByAuthor: !sharing,
      ...(media
        ? {
            content: {
              media: {
                altText: text.substring(0, 25),
                id: media,
              },
            },
          }
        : {}),
    },
    resourcePath: "/posts",
    versionString: config.linkedin.version,
  });
}

/**
 * @param {String} accessToken
 * @param {String} userId
 * @returns {Object}
 */
function upload(accessToken, userId) {
  return client
    .action({
      accessToken,
      actionName: "initializeUpload",
      data: {
        initializeUploadRequest: {
          owner: `urn:li:person:${userId}`,
        },
      },
      resourcePath: "/images",
      versionString: config.linkedin.version,
    })
    .then(({ data }) => data.value);
}

module.exports = {
  post,
  upload,
};
