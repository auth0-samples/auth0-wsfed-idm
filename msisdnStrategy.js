var CustomStrategy = require('passport-custom');
var crypto = require('crypto');
var UnauthorizedError = require('./UnauthorizedError');

const sha256 = (secret) => {
    return crypto.createHmac('sha256', secret)
        .update('l;jasdfjdauiasdfjlweru@23mas.dfjl')
        .digest('hex');
}

module.exports = new CustomStrategy(function (req, done) {
    const msisdn = req.authParams.login_hint;
    if (msisdn === process.env.APPROVED_MSISDN) {
        return done(null, {
            id: sha256(msisdn),
            phone_number: msisdn,
            phone_verified: true,
        });
    }

    done(new UnauthorizedError('unauthorized', 'MSISDN could not be validated'));
});
