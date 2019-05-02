const express = require('express');
const csrf = require('csurf')();

const imageUpload = require('../utils/image-upload');
const recaptcha = require('../utils/recaptcha');
const cloudinary = require('../utils/cloudinary');
const cleanup = require('../utils/cleanup');

const Post = require('../models/post');

const router = express.Router();

const deleteImageFiles = cleanup(req => [req.file.path, req.file.minified]);

router.get('/', (req, res, next) => {
  Post.find({}, (err, posts) => {
    if (err) {
      next(err);
      return;
    }
    res.render('index', { posts });
  });
});

router.get('/upload', csrf, (req, res) => {
  const csrfToken = req.csrfToken();
  const recaptchaSiteKey = recaptcha.getSiteKey();
  res.render('new', { csrfToken, recaptchaSiteKey });
});

router.post('/upload',
  imageUpload.single('gallery'),
  csrf,
  recaptcha.validate(),
  cloudinary,
  deleteImageFiles,
  async (req, res, next) => {
    const { post } = req.body;
    const newPost = {
      ...post,
      image: req.cloudinary.secure_url,
    };

    Post.create(newPost, (err2) => {
      if (err2) {
        next(err2);
        return;
      }
      req.flash('success', 'Image successfully added');
      res.redirect('/');
    });
  });

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  req.flash('error', err.message);
  res.redirect('back');
});

module.exports = router;
