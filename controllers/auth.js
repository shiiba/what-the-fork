var express = require('express');
var router = express.Router();
var passport = require('../config/passport.js');
var User = require('../models/users.js');
var jwt = require('jsonwebtoken');

// INTIALIZING PASSPORT
router.use(passport.initialize());

router.get('/', function(req, res) {
	res.send('meow')
});

// IF LOGIN IS SUCCESSFUL, TOKEN IS SENT BACK
router.post('/', passport.authenticate('local', { session: false }), function(req, res, next) {
	console.log('CAN YOU HEAR ME??');
  console.log('==========================');
	console.log('req.body: ' + req.body);
  // console.log('USER:' + req.user.email);
	console.log('==========================');

	var token = jwt.sign(req.user, process.env.JWT_SECRET, {
		expiresIn: 1400
	});

	var userId = req.user._id;
	console.log('userId: ' + userId);

	console.log(token);
	res.json({ 
		token: token, 
		userId: userId
	});
});

module.exports = router;

