var express = require('express');
var mongoose = require('mongoose');
var db = process.env.MONGODB_URI || "mongodb://localhost/what_the_fork_dev";
var router = express.Router();
var User = require('../models/users.js');
var Recipes = require('../models/recipes.js');

router.get('/', function(req, res){
	var user1 = new User({
		firstName: 'Joe',
		lastName: 'Jungle',
		email: 'joe@jit.com',
		password: 'password',
		recipeHistory: []
	});

	var recipe1 = new Recipes({
		label: 'Chicken, Rice And Broad Bean Soup',
		image: 'https://www.edamam.com/web-img/b8c/b8c55ead94cfd89c62c1364a91d9baac.jpg',
		uri: 'http://www.edamam.com/ontologies/edamam.owl#recipe_f4465a93e4a32949624238d735b44400',
		ingredients: [
		"1 tbsp olive oil",
    "1 brown onion, chopped",
    "1 clove garlic, crushed",
    "2 bay leaves",
    "4 sprigs thyme",
    "1.5 litres chicken stock",
    "2 x 200g chicken breast fillets, trimmed",
    "400 g sebago (starchy) potatoes, peeled and chopped",
    "⅓ cup (65g) long-grain rice",
    "2 cups frozen broad beans, blanched and peeled",
    "Sea salt and cracked black pepper",
    "⅓ cup chopped flat-leaf parsley leaves"
    ]
	});

	var recipe2 = new Recipes({
		label: 'Skillet Chicken with Homemade Rice-A-Roni and Green Beans',
		image: 'https://www.edamam.com/web-img/626/626d4e8517de212f097340b20aa70c4e.jpg',
		uri: 'http://www.seriouseats.com/recipes/2012/09/skillet-chicken-with-homemade-rice-a-roni-and-green-beans-recipe.html',
		ingredients: [
		"For the chicken rice-a-roni:",
    "8 pieces chicken thighs and/or drumsticks (about 2 pounds)",
    "2 1/2 tablespoons olive oil, divided",
    "2 1/2 ounces (about 1/3 of a box) uncooked thin spaghetti, broken into 1/2-inch pieces",
    "1 3/4 cups long grain rice",
    "1 large bay leaf",
    "4 cups low-sodium store-bought or homemade chicken broth",
    "1/8 teaspoon saffron threads",
    "1/4 teaspoon ground turmeric",
    "Kosher salt and freshly ground black pepper",
    "For the green beans:",
    "4 medium cloves garlic, minced (about 4 teaspoons)",
    "1 pound green beans, trimmed and halved crosswise"
    ]
	});

	user1.save();
	recipe1.save();
	recipe2.save();
	user1.recipeHistory.push(recipe1);
	user1.recipeHistory.push(recipe2);
	user1.save();

	console.log('======================');
	console.log('SEEDING DONE! WOOT!');
	console.log('======================');
	res.end();
});

module.exports = router;
