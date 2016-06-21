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

router.post('/register', function(req, res){
	console.log('req.body: ' + req.body);
  User.create(req.body, function(err, user){
    if(err){
      console.log(err);
      res.status(500).end();
    // } else {
    //   passport.authenticate('local', { session: false }), function(req, res, next){
    //     var token = jwt.sign(req.user, process.env.JWT_SECRET, {
    //     expiresIn: 1400
    //     });
    //     var userId = req.user._id;
    //     console.log('userId: ' + userId);
    //     console.log(token);
    //     res.json({ 
    //       token: token, 
    //       userId: userId
    //     });
    //     res.redirect('/users');
      }
    res.send(true);
  });
});

 //  var user = new User({username: req.body.username, password: req.body.password});
	// user.save(function(err){
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		console.log('user: ' + user);
	// 		req.login(user, function(err){
	// 			if (err){
	// 				console.log(err);
	// 			}
	// 			return res.redirect('/users');
	// 		});
	// 	}
	// });


////The way of doing it now
// router.post('/', function(req, res) {
// 	User.create(req.body, function(err, user) {
// 		if(err) {
// 			console.log(err); 
// 			res.status(500).end();
// 		}
// 		res.send(user);
// 	});
// });

// router.post('/register', function(req, res) {
//     Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
//         if (err) {
//             return res.render('register', { account : account });
//         }

//         passport.authenticate('local')(req, res, function () {
//             res.redirect('/');
//         });
//     });
// });

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

router.get('/recipes', function(req, res, next) {
  console.log('user id: ' + req.user._id);
  User.findById(req.user.id).then(function(user) {
    console.log(user);
    res.send(user);
	});
});

router.put('/recipes', function(req, res){
	User.findById(req.user._id).then(function(user){
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

