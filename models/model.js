// post.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AuthorSchema = new Schema({
	name: String
});

var Author = mongoose.model('Author', AuthorSchema);

var CommentSchema = new Schema({
	body: String,
	date: String
});

var Comment = mongoose.model('Comment', CommentSchema);

var PostSchema = new Schema({
  // author: {
  //   		type: Schema.Types.ObjectId,  //REFERENCING :D
  //   		ref: 'Author'
  // 		},
  name: String,
  body: String,
  date: String,
  comments: [CommentSchema]
});

var Post = mongoose.model('Post', PostSchema);

module.exports.Post = Post;
module.exports.Comment = Comment;
module.exports.Author = Author;