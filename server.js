// require express framework and additional modules
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    _ = require("underscore");

// Connect to Database
mongoose.connect('mongodb://localhost/mini-blog');

var db = require('./models/model');

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
  db.Post.find(function (err, foundPosts) {
    res.json(foundPosts);
  });
});

// MONGODB Set up route for /users/id 
app.get("/api/posts/:id", function(req, res) {

  // set the value of the id
  var targetId = req.params.id;

  db.Post.findOne({_id: targetId}, function (err, foundPost) {

    res.json(foundPost);

  });

});

// MONGODB New Post
app.post('/api/posts', function (req, res) {

  // create the author (we'll assume it doesn't exist yet)
  var newAuthor = new db.Author({
    name: req.body.author
  });
  newAuthor.save();

  var newPost = new db.Post({
    name: req.body.name,
    body: req.body.body,
    date: req.body.date,
    comments: []
  });
  newPost.save(function (err, savedPost) {
    res.json(savedPost);
  });
});

// MONGODB New Comment
app.post('/api/posts/:id/comments', function (req, res) {

  // set the value of the id
  var targetId = req.params.id

  db.Post.findOne({_id: targetId}, function (err, foundPost) {

    // grab params from form data
    var newComment = new db.Comment({
      body: req.body.body,
      date: req.body.date
    });

    // add newPhrase to `phrases` array
    foundPost.comments.push(newComment);

    foundPost.save(function (err, savedComment) {
      // send newPhrase as JSON response
      res.json(foundPost);
    });

  });

});

// MONGODB Edit Post
app.put('/api/posts/:id', function (req, res) {
  var targetId = req.params.id;
  db.Post.findOne({_id: targetId}, function (err, foundPost) {
    foundPost.name = req.body.name;
    foundPost.body = req.body.body;
    foundPost.date = req.body.date;
    foundPost.comments = req.body.comments;

    foundPost.save(function (err, foundPost) {
      res.json(foundPost);
    });
  });
});

// MONGODB
app.delete("/api/posts/:id", function (req, res) {

  var targetId = req.params.id;

  // find phrase in db by id and remove
  db.Post.findOneAndRemove({_id: targetId}, function (err, deletedPost) {
    res.json(deletedPost);
  });

});



// listen on port 3000
app.listen(3000, function () {
  console.log("server started on localhost:3000");
});