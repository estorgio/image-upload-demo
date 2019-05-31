const mongoose = require('mongoose');

const volatile = process.env.VOLATILE_MODE.trim().toLowerCase() === 'true';

const PostSchema = new mongoose.Schema({
  title: String,
  created: { type: Date, default: Date.now },
  image: String,
  description: String,
  volatile: { type: Boolean, default: volatile },
});

module.exports = mongoose.model('Post', PostSchema);
