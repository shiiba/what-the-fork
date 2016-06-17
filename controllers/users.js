var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var Recipe = require('../models/recipes.js');

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

// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
// router.use(passport.authenticate('jwt', { session: false }));

//INDEX. Gets the saved cooking recipes
router.get('/:id/recipes', function(req, res, next) {
	User.findById(req.params.id).then(function(user) {
		res.send(user.recipeHistory)
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

