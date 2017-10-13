var path = require("path");
// Article and Note models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Routes
module.exports = function(app) {

	// Get request for the index
	app.get("/", function(req, res){
		Article.find({}).populate("notes").exec(function(err, doc) {
			if (err) console.log(err);
			else res.render("index", {article: doc});
		});
	})

	// A GET request to scrape the echojs website
	app.get("/scrape/:category?", function(req, res) {
		// First, we grab the body of the html with request
		//const scrapeUrl = req.params.category ? `https://www.sciencedaily.com/news/${req.params.category}/`: `https://www.sciencedaily.com/news/`;
		const scrapeUrl = "https://www.livescience.com/animals?type=article";
		const baseUrl = "https://www.livescience.com";
		request(scrapeUrl, function(error, response, html) {
			const $ = cheerio.load(html);
			$("div.contentListing > ul.mod > li.search-item").each(function(i, element) {
	
				let result = {};
	
				result.title = $(this).find("div.list-text>h2>a").text().trim();
				result.link = baseUrl + $(this).find("div.list-text>h2>a").attr("href");
				result.date = $(this).find("div.list-text>div.date-posted").text().split("|")[0].trim();
				result.summary = $(this).find("div.list-text>p.mod-copy").html().split("<br>")[0].replace(/\n/g, '').trim();
				// image won't display on remote site, so we won't save that
				// result.image = $(this).find("a>img.pure-img").attr("src");			

				const entry = new Article(result);
	
				//Now, save that entry to the db
				entry.save(function(err, doc) {
					if (err) console.log(err);
					else console.log(doc);
				});
	
			});
		});
		res.send("Scrape Complete");
	});
};