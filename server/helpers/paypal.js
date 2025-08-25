/*const paypal = require("@paypal/paypal-server-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AdlTRKsPO6hFYIbtE7R5FJow14sN-2KDb9C6d_irfMeFqQua0dThsaJQZenkc_u8I08w8az4KGuvGO6x",
  client_secret:
    "ECqtjHn_Y5uBuTPvxyX5P5ipPskatxMyg924RGIuh4iWTSnCq2HJL_SxN3r3gavoCQAhr8oR2lmjsM43",
});

module.exports = paypal;*/

/*const paypal = require("@paypal/paypal-server-sdk");

// Create PayPal client (Sandbox by default, switch to LiveEnvironment for production)
const client = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    "AdlTRKsPO6hFYIbtE7R5FJow14sN-2KDb9C6d_irfMeFqQua0dThsaJQZenkc_u8I08w8az4KGuvGO6x",
    "ECqtjHn_Y5uBuTPvxyX5P5ipPskatxMyg924RGIuh4iWTSnCq2HJL_SxN3r3gavoCQAhr8oR2lmjsM43"
  )
);

module.exports = client;*/

/*const { Client, Environment, LogLevel } = require("@paypal/paypal-server-sdk");

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId:
      "AdlTRKsPO6hFYIbtE7R5FJow14sN-2KDb9C6d_irfMeFqQua0dThsaJQZenkc_u8I08w8az4KGuvGO6x",
    oAuthClientSecret:
      "ECqtjHn_Y5uBuTPvxyX5P5ipPskatxMyg924RGIuh4iWTSnCq2HJL_SxN3r3gavoCQAhr8oR2lmjsM43",
  },
  environment: Environment.Sandbox,
  timeout: 0,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

module.exports = client;*/
// server/helpers/paypal.js
module.exports = {
  PAYPAL_API: process.env.PAYPAL_API, // sandbox base URL
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
};
