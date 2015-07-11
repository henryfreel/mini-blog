// require express framework and additional modules
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser");

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
    id: 1,
    name: "Bob - API",
    body: "here is my api body",
    comments: [{body: "API comment", date: "0/0/00"}]
  },
  {
    id: 2,
    name: "Julie - API",
    username: "here is my api body",
    comments: [{body: "API comment", date: "0/0/00"}]
  }
];

// set up route for /users JSON
app.get("/api/posts", function(req, res) {
  res.json(posts);
});


// listen on port 3000
app.listen(3000, function () {
  console.log("server started on localhost:3000");
});