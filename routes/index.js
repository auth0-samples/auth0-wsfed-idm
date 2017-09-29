var wsfed = require('wsfed');
var express = require('express');
var passport = require('passport');
var router = express.Router();
var UnauthorizedError = require('../UnauthorizedError');

const auth = (req, res, next) => wsfed.auth(req.wsfedOptions)(req, res, next);
const metadata = (req, res, next) => wsfed.metadata(req.wsfedOptions)(req, res, next);
const sendError = (error, req, res, next) => {
  if (error.isUnauthorizedError === true) {
    return wsfed.sendError(Object.assign({}, req.wsfedOptions, {fault: error}))(req, res, next);
  }
  if (req.query.wctx) {
    return wsfed.sendError(Object.assign({}, req.wsfedOptions, {
      fault: new UnauthorizedError('login_failed', error.message)
    }))(req, res, next);
  }
  next(error);
}

router.get('/FederationMetadata/2007-06/FederationMetadata.xml', metadata);
router.get('/', (req, res, next) => {
  req.authParams = req.query;
  passport.authenticate('msisdnStrategy', function (err, user, info) {
    if (user) {
      req.user = user;
      return next();
    }
    if (err) {
      return next(err);
    }
    next(new UnauthorizedError('login_failed', 'Unexpected, no user or error'));
  })(req, res);
}, auth);
router.use(sendError);

module.exports = router;
