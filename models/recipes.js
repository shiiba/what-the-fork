var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
  label: String,
  image: String,
  uri: String,
  ingredients: [String]
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
