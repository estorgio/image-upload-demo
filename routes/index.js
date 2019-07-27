const express = require('express');
const csrf = require('csurf')();
const imageUpload = require('../utils/image-upload');
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

router.post(
  '/upload',
  imageUpload.single('gallery'),
  csrf,
  recaptcha.validate(),
  async (req, res) => {
    const { title, description } = req.body.post;
    const upload = await req.startUpload();

    await Post.create({
      title,
      description,
      image: upload.secure_url,
    });

    req.flash('success', 'Image successfully added');
    res.redirect('/');
  },
);

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  req.flash('error', err.message);
  res.redirect('back');
});

module.exports = router;
