var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var Recipe = require('../models/recipes.js');
var request = require('request');
var util = require('util');

function deepPrint(x){
  console.log(util.inspect(x, {showHidden: false, depth: null}));
}

// ------------------------------
// ROUTES THAT DON'T REQUIRE AUTH
// ------------------------------

// CREATE A NEW USER
router.post('/', function(req, res) {
	User.create(req.body, function(err, user) {
		if(err) {
			console.log(err); 
			res.status(500).end();
		}
		res.send(user);
	});
});

router.post('/search', function(req,res){   // add in user ID?
	var ingredientQuery = req.body.ingredients;
	deepPrint(ingredientQuery);
  request("https://api.edamam.com/search?q=" + ingredientQuery + "&app_id=" + process.env.EDAMAM_ID + "&app_key=" + process.env.EDAMAM_KEY, function(error, response, body){
    if(!error && response.statusCode == 200){
    	results = JSON.parse(body);
    	res.send(results);
    }
  });
});

// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
router.use(passport.authenticate('jwt', { session: false }));

//INDEX. Gets the saved cooking recipes

router.get('/:id/recipes', function(req, res, next) {
	User.findById(req.params.id).then(function(user) {
    console.log(user);
    res.send(user);
	});
});

router.put('/:id/recipes', function(req, res){
	User.findById(req.params.id).then(function(user){
		var recipe = new Recipe(req.body);
		user.recipeHistory.push(recipe);
		user.save(function(err){
			if(err){
				console.log(err);
				res.send(false);
			} else {
				res.send(user);
			}
		});
	});
});

module.exports = router;

