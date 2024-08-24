const { Issuer, generators } = require("openid-client");
const config = require("../config");

let issuer;

async function create() {
  if (!issuer) {
    issuer = await Issuer.discover("https://www.linkedin.com/oauth");
  }

  return new issuer.Client({
    client_id: config.linkedin.clientId,
    client_secret: config.linkedin.clientSecret,
    redirect_uris: [`${config.app.url}/login/callback`],
    response_types: ["code"],
    token_endpoint_auth_method: "client_secret_post",
  });
}

async function authorize() {
  const client = await create();
  const state = generators.state();

  const url = client.authorizationUrl({
    scope: config.linkedin.scopes.join(" "),
    state,
  });

  return [url, state];
}

async function finalize(req, state) {
  const client = await create();
  const params = client.callbackParams(req);

  return client.callback(`${config.app.url}/login/callback`, params, { state });
}

async function userInfo(accessToken) {
  const client = await create();

  return client.userinfo(accessToken);
}

module.exports = {
  authorize,
  finalize,
  userInfo,
};
