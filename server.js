// require express framework and additional modules
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    _ = require("underscore");

// Connect to Database
mongoose.connect('mongodb://localhost/mini-blog');

var Post = require('./models/post');

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// set up root route to send index.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/views/index.html");
});

// for local host?
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// MONGODB Load Posts
app.get('/api/posts', function (req, res) {
  Post.find(function (err, posts) {
    res.json(posts);
  });
});

// var posts = [];

// set up route for /users JSON
// app.get("/api/posts", function(req, res) {
//   res.json(posts);
// });

// MONGODB Set up route for /users/id 
app.get("/api/posts/:id", function(req, res) {

  // set the value of the id
  var targetId = req.params.id;

  Post.findOne({_id: targetId}, function (err, foundPost) {

    res.json(foundPost);

  });

});

// // set up route for /users/id JSON
// app.get("/api/posts/:id", function(req, res) {

//   // set the value of the id
//   var targetId = parseInt(req.params.id);

//   // find item in `phrases` array matching the id
//   var foundPost = _.findWhere(posts, {id: targetId});

//   res.json(foundPost);

// });

// MONGODB New Post
app.post('/api/posts', function (req, res) {
  var newPost = new Post({
    name: req.body.name,
    body: req.body.body,
    date: req.body.date,
    comments: []
  });
  newPost.save(function (err, savedPost) {
    res.json(savedPost);
  });
});

// create new post
// app.post('/api/posts', function (req, res) {
//   // grab params (word and definition) from form data
//   var newPost = req.body;

//   // set sequential id (last id in `phrases` array + 1)
//   if (posts.length > 1) {
//     newPost.id = posts[posts.length - 1].id +  1;
//   } else {
//     newPost.id = 1;
//   }

//   newPost.comments = [];

//   // add newPost to `phrases` array
//   posts.push(newPost);
  
//   // send newPost as JSON response
//   res.json(newPost);
// });

// MONGODB New Comment
app.post('/api/posts/:id/comments', function (req, res) {

  // set the value of the id
  var targetId = req.params.id

  Post.findOne({_id: targetId}, function (err, foundPost) {

    // grab params from form data
    var newComment = req.body;

    // add newPhrase to `phrases` array
    foundPost.comments.push(newComment);

    foundPost.save(function (err, savedComment) {
      // send newPhrase as JSON response
      res.json(foundPost);
    });

  });

});

// create new comment
// app.post('/api/posts/:id/comments', function (req, res) {

//   // set the value of the id
//   var targetId = parseInt(req.params.id);

//   // find item in `phrases` array matching the id
//   var foundPost = _.findWhere(posts, {id: targetId});

//   // grab params from form data
//   var newComment = req.body;

//   // add newPhrase to `phrases` array
//   foundPost.comments.push(newComment);
  
//   // send newPhrase as JSON response
//   res.json(newComment);
// });

// MONGODB Edit Post
app.put('/api/posts/:id', function (req, res) {
  var targetId = req.params.id;
  Post.findOne({_id: targetId}, function (err, foundPost) {
    foundPost.name = req.body.name;
    foundPost.body = req.body.body;
    foundPost.date = req.body.date;
    foundPost.comments = req.body.comments;

    foundPost.save(function (err, foundPost) {
      res.json(foundPost);
    });
  });
});

// edit post
// app.put('/api/posts/:id', function (req, res) {

//   // set the value of the id
//   var targetId = parseInt(req.params.id);

//   // find item in `phrases` array matching the id
//   var foundPost = _.findWhere(posts, {id: targetId});

//   // update the phrase's word
//   foundPost.body = req.body.body;

//   // update the phrase's definition
//   foundPost.date = req.body.date;

//   // send back edited object
//   res.json(foundPost);

// });

// MONGODB
app.delete("/api/posts/:id", function (req, res) {

  var targetId = req.params.id;

  // find phrase in db by id and remove
  Post.findOneAndRemove({_id: targetId}, function (err, deletedPost) {
    res.json(deletedPost);
  });

});



// listen on port 3000
app.listen(3000, function () {
  console.log("server started on localhost:3000");
});