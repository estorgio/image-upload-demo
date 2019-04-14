const axios = require('axios');

require('dotenv').config();

function getSiteKey() {
  return process.env.RECAPTCHA_SITE_KEY;
}

function getSecretKey() {
  return process.env.RECAPTCHA_SECRET_KEY;
}

async function verifyToken(token) {
  const secretKey = getSecretKey();

  let recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify?';
  recaptchaUrl += `secret=${secretKey}&`;
  recaptchaUrl += `response=${token}`;

  const response = await axios.post(recaptchaUrl, {});

  return response.data.success;
}

module.exports = { getSiteKey, getSecretKey, verifyToken };
