/**
Generate a signing key
**/
const selfsigned = require('selfsigned');
const ursa = require('ursa');
const fs = require('fs');

function generateSelfSigned(commonName, cb) {
  const attrs = [{ name: 'commonName', value: commonName }];
  const extensions = [{
    name: 'basicConstraints',
    cA: true,
    critical: true
  }, {
    name: 'subjectKeyIdentifier'
  }, {
    name: 'keyUsage',
    digitalSignature: true,
    keyCertSign: true,
    critical: true
  }];

  try {
    const keyPair = ursa.generatePrivateKey(2048, 65537); // size, exponent
    const cert = selfsigned.generate(attrs, {
      pkcs7: true,
      days: 5000,
      algorithm: 'sha256',
      keyPair: {
        privateKey: keyPair.toPrivatePem().toString(),
        publicKey: keyPair.toPublicPem().toString()
      },
      extensions: extensions
    });

    const keyData = {
      key: cert.private,
      cert: cert.cert,
      pkcs7: cert.pkcs7,
      subject: '/CN=' + commonName
    };
    fs.writeFile('signingKey.json', JSON.stringify(keyData, null, 2), 'utf8', function (err, result) {
      cb(null, keyData);
    });

  } catch(e) {
    cb(e);
  }
}

function generateSigningKey(commonName, cb) {
  generateSelfSigned(commonName, function(err, signingKey) {
    if (err) { return cb(err); }
    cb(null, signingKey);
  });
}

module.exports = {
  generateSigningKey: generateSigningKey,
  generateSigningKeyInPlainText: generateSelfSigned
}


generateSigningKey('my.demo.api', console.log);

