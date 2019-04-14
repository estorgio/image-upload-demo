const express = require('express');
const csrf = require('csurf')();

const imageUpload = require('../utils/image-upload');
const cloudinary = require('../utils/cloudinary');
const recaptcha = require('../utils/recaptcha');

const Post = require('../models/post');

const router = express.Router();

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
  cloudinary(imageUpload.single('gallery')),
  async (req, res, next) => {
    // const { filename: image } = req.file;
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
