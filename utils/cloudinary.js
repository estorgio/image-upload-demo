const cloudinary = require('cloudinary');
const sharp = require('sharp');
const csrf = require('csurf')();
const path = require('path');
const util = require('util');
const fs = require('fs');

require('dotenv').config();

const unlink = util.promisify(fs.unlink);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function cleanup(imageFile) {
  if (imageFile && fs.existsSync(imageFile)) {
    await unlink(imageFile);
  }
}

function validateCSRFToken(req, res) {
  return new Promise((resolve, reject) => {
    csrf(req, res, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function uploadToCloudinary(imageFile) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(imageFile, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function invokeMulterMiddleware(req, res, multerMiddleware) {
  return new Promise((resolve, reject) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(req.file);
    });
  });
}

async function minifyImage(inputImage, outputImage) {
  return sharp(inputImage)
    .resize(300, 300)
    .jpeg({
      quality: 75,
      progressive: true,
    })
    .toFile(outputImage);
}

function upload(multerMiddleware) {
  let originalImage;
  let minifiedImage;

  return async (req, res, next) => {
    try {
      await invokeMulterMiddleware(req, res, multerMiddleware);

      originalImage = req.file.path;
      minifiedImage = path.join(req.file.destination,
        `${path.parse(req.file.path).name}_converted.jpg`);

      await validateCSRFToken(req, res);

      await minifyImage(originalImage, minifiedImage);
      await unlink(originalImage);

      const result = await uploadToCloudinary(minifiedImage);
      req.cloudinary = result;

      await unlink(minifiedImage);
      next();
    } catch (err) {
      await cleanup(originalImage);
      await cleanup(minifiedImage);
      next(err);
    }
  };
}

module.exports = upload;
