
// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use body parser with our app
app.use(bodyParser.urlencoded({ extended: false }));

// Make public a static dir
app.use(express.static(__dirname + "/public"));

// Set up handlebars
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/livescience";

// Connect mongoose to our database
mongoose.connect(db, function(error) {
  if (error) console.log(error);
  else console.log("Mongoose connected.");
});

// Controllers
require("./controllers/api-routes.js")(app);
require("./controllers/html-routes.js")(app);

app.listen(process.env.PORT || 3000, function() {
  console.log("App running.");
});
