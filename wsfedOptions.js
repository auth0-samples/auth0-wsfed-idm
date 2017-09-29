var wsfed = require('wsfed');
const signingKey = require('./signingKey.json');
const profileMapper = require('./profileMapper');

module.exports = (req, res, next) => {

  const query = req.query;
  const env = process.env;

  const options = {
    getPostURL(wtrealm, wreply, req, callback) {
      if (callback === undefined) {
        callback = wreply;
      }
      return callback(null, `https://${env['AUTH0_DOMAIN']}/login/callback`);
    },
    profileMapper: profileMapper,
    audience: env['WTREALM'],
    issuer: env['ISSUER_NAME'],
    key: signingKey.key,
    cert: signingKey.cert
  };

  req.wsfedOptions = Object.assign({}, options, {
    audience: query.wtrealm,
    wctx: query.wctx
  });

  next();
}
