const { RestliClient } = require("linkedin-api-client");
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
function post(
  accessToken,
  userId,
  text = "",
  media = null,
  visibility = "PUBLIC",
  draft = false,
  distribute = true,
  sharing = true,
) {
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
