class UnauthorizedError extends Error {
  constructor(code, description) {
      super();
      this.code = code;
      this.description = description;
      this.isUnauthorizedError = true;
  }
  static isUnauthorizedError(instance) {
      return instance.isUnauthorizedError === true;
  }
};

module.exports = UnauthorizedError;
