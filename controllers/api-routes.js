var path = require("path");
// Article and Note models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Routes
module.exports = function(app) {

	// A POST request for scraping
	app.post("/scrape", (req, res)=>{
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
  
	// Create a new note for an article
	app.post("/note/:id", (req, res)=>{
		var newNote = new Note(req.body);
		// And save the new note the db
		newNote.save((err, doc)=>{
			if (err) console.log(err);
			else {
				// Use the article id to add note ref to its "notes"
				Article.findOneAndUpdate({}, { $push: { "notes": doc._id } }, { new: true }).populate("notes").exec((err, newdoc)=>{
					if(err) res.send(err);
					else res.send(newdoc);
				});
			}
		});
	});

	// Remove note by id
	app.delete("/note", (req, res)=>{
		//assigns req body values for querying 
		const articleRef = req.body.articleRef; 
		//removes the comment based on its unique id
		Note.remove({"_id": req.body._id}).exec((err, removed)=>{
			if(err) res.send(err)
			else {
				//removes note ref from Article
				Article.findOneAndUpdate({"_id":req.body.articleRef}, { $pull: { "notes":req.body._id } }, { new: true }).populate("notes").exec((err, newdoc)=> {
				    if (err) res.send(err);
					else res.send(newdoc);
				})
			}
		})
	})
};