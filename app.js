var fs = require('fs');
require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');
var passport = require('passport');
var index = require('./routes/index');
var wsfedOptions = require('./wsfedOptions');
var msisdnStrategy = require('./msisdnStrategy');

/**
 *Set up the env. variables
 *
*/
function setupEnvVariables() {
  try {
    const configFile = fs.readFileSync('./signingKey.json').toString('utf8');
    const envVariables = JSON.parse(configFile);
    Object.assign(process.env, envVariables);
  } catch (e) {
    console.error("Please check the signingKey.json file in the root of the repository");
    console.error(e);
    process.exit(-1);
  }
}
// execute it..
setupEnvVariables();

var app = express();
app.use(logger('dev'));
app.use(passport.initialize());
app.use(wsfedOptions);

passport.use('msisdnStrategy', msisdnStrategy);

app.use('/', index);

 // catch 404 and forward to error handler
 app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  if (process.env.NODE_ENV === 'dev') {
      console.log(err);
      res.status(err.status || 500);
      return res.json(err);
  }
  return res.status(err.status || 500).end('Internal server error');
});

module.exports = app;
