const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  // link is a string holding the url of the article, it's unique as a lazy way of preventing duplicates
  link: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
