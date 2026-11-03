const crypto = require('crypto');

const sendError = (res, error, statuscode = 401) => {
  res.status(statuscode).json({ error });
};

const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const bufferString = buff.toString('hex');
      console.log(bufferString);
      resolve(bufferString);
    });
  });
};

const handelNotFound = (req, res) => {
  sendError(res, 'Not Found', 404);
};

module.exports = {
  sendError,
  generateRandomByte,
  handelNotFound,
};
