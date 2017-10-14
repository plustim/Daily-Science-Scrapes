var path = require("path");
// Article and Note models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// Routes
module.exports = function(app) {

	// Get request for the index
	app.get("/", function(req, res){
		Article.find({}).populate("notes").exec(function(err, doc) {
			if (err) console.log(err);
			else res.render("index", {article: doc});
		});
	})
};