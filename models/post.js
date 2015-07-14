// post.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  name: String,
  body: String,
  date: String,
  comments: Array
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;