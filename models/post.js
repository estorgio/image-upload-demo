const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  created: { type: Date, default: Date.now },
  image: String,
  description: String,
});

module.exports = mongoose.model('Post', PostSchema);
