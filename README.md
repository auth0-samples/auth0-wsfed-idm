## What is this?

Illustrates how it is possible to write a custom authentication strategy (here, using passport-custom NPM module & checking for a matching phone number).

In Auth0, setup an ADFS Connection.

### Setup

Clone the repo, and from root:

```
yarn install
```

Rename env.sample to .env and update props:

```
AUTH0_DOMAIN={{TENANT_NAME}}.auth0.com
ISSUER_NAME={{ANYTHING_YOU_WANT}}
WTREALM=urn:auth0:{{TENANT_NAME}}
```

You can use `node generateKey` to generate a `signingKey.json` file.

Finally:

```
npm start
```

Should be easy enough to see how you could change the Custom Strategy to something else.

The base project is just composed by running the express generator - `express auth0-wsfed-idm`, then the static public directory and views were removed.Finally, the error handling in app.js was altered to use res.json instead of res.render() since there is no view layer. All the wsfed logic is really a configuration / wrapper onto the `wsfed` NPM module. Most of the wsfed specific logic lives inside `wsfedOptions.js`,`profileMapper.js` and `routes/index.js`.

- Alter the `msisdnStrategy` middleware,
- Alter the profileMapper to be the claims your strategy requires
- Check app.js, and routes/index.js to ensure your strategy cleanly replaces any msisdn related references.

runNgrok.sh is a convenience for exposing your locally running app to the Internet so that Auth0 can reach it.

Execute urls of the form:

```https://quickstart-playground.auth0.com/authorize?login_hint=123&client_id=y6pfX1vJb0KzTTES-Yw9e2BDe6szDwuT&response_type=code&connection=myMSConn&prompt=consent&redirect_uri=https://manage.auth0.com/tester/callback?connection=myMSConn
```

### Honours

This sample is a shameless rewrite of a similar sample written by Abhishek, and the Certificate Generation script was "borrowed" from Justin. Thanks guys.