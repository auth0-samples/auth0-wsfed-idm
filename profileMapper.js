const fm = {
  'nameIdentifier': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  'phoneNumber': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phonenumber',
  'phoneVerified': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phoneverified'
};

const claimsOffered = [
  {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    optional: true,
    displayName: 'Name ID',
    description: 'The SAML name identifier of the user'
  }, {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phonenumber",
    optional: false,
    displayName: 'Phone Number',
    description: 'The phone number of the user'
  }, {
    id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phoneverified",
    optional: false,
    displayName: 'Phone Number Verified',
    description: 'Is phone number verified for the user'
  }
];

class ProfileMapper {
  constructor(pu) {
    this._pu = pu;
  }

  getClaims() {
    var claims = {};
    claims[fm.nameIdentifier] = this._pu.id;
    claims[fm.phoneNumber] = this._pu.phone_number;
    claims[fm.phoneVerified] = this._pu.phone_verified;
    return claims;
  }

  getNameIdentifier() {
    var claims = this.getClaims();
    return {
      nameIdentifier: claims[fm.nameIdentifier]
    };
  }

}

// /metadata endpoint expects metadata be defined on .prototype /auth expects
// this to be a function The only solution for clean code.
function ExposedProfileMapper(...args) {
  return new ProfileMapper(...args);
}

ExposedProfileMapper.prototype.metadata = claimsOffered;

module.exports = ExposedProfileMapper;
