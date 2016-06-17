var express = require('express');
var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
  title: String,
  img: String,
  url: String,
  ingredients: [String]
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
