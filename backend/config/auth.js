const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  EMAIL_PATTERN,
};
