// require express framework and additional modules
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    _ = require("underscore");


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

var posts = [];

// set up route for /users JSON
app.get("/api/posts", function(req, res) {
  res.json(posts);
});

// set up route for /users/id JSON
app.get("/api/posts/:id", function(req, res) {

  // set the value of the id
  var targetId = parseInt(req.params.id);

  // find item in `phrases` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  res.json(foundPost);

});


// create new post
app.post('/api/posts', function (req, res) {
  // grab params (word and definition) from form data
  var newPost = req.body;

  // set sequential id (last id in `phrases` array + 1)
  if (posts.length > 1) {
    newPost.id = posts[posts.length - 1].id +  1;
  } else {
    newPost.id = 1;
  }

  newPost.comments = [];

  // add newPost to `phrases` array
  posts.push(newPost);
  
  // send newPost as JSON response
  res.json(newPost);
});


// create new comment
app.post('/api/posts/:id/comments', function (req, res) {

  // set the value of the id
  var targetId = parseInt(req.params.id);

  // find item in `phrases` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  // grab params from form data
  var newComment = req.body;

  // add newPhrase to `phrases` array
  foundPost.comments.push(newComment);
  
  // send newPhrase as JSON response
  res.json(newComment);
});

// edit post
app.put('/api/posts/:id', function (req, res) {

  // set the value of the id
  var targetId = parseInt(req.params.id);

  // find item in `phrases` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  // update the phrase's word
  foundPost.body = req.body.body;

  // update the phrase's definition
  foundPost.date = req.body.date;

  // send back edited object
  res.json(foundPost);

});






// listen on port 3000
app.listen(3000, function () {
  console.log("server started on localhost:3000");
});