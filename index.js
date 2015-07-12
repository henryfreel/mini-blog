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

var posts = [
  {
    date: "00/00/00",
    name: "Bob - API",
    body: "here is my api body",
    comments: [{comment_body: "API comment", comment_date: "0/0/00"}],
    id: 1
  },
  {
    date: "00/00/00",
    name: "Julie - API",
    body: "here is my api body",
    comments: [{comment_body: "API comment", comment_date: "0/0/00"}],
    id: 2
  }
];

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

// create new phrase
app.post('/api/posts', function (req, res) {
  // grab params (word and definition) from form data
  var newPost = req.body;

  // set sequential id (last id in `phrases` array + 1)
  if (posts.length > 0) {
    newPost.id = posts[posts.length - 1].id +  1;
  } else {
    newPost.id = 0;
  }

  // add newPhrase to `phrases` array
  posts.push(newPost);
  
  // send newPhrase as JSON response
  res.json(newPost);
});






// listen on port 3000
app.listen(3000, function () {
  console.log("server started on localhost:3000");
});