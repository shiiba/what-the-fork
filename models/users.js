var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var recipeSchema = require('./recipes.js').schema;

var UserSchema = new mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  username: { type: String, unique: true, require: true },
  password: { type: String },
  recipeHistory: [recipeSchema]
});

UserSchema.pre('save', function(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.methods.authenticate = function(passwordTry) {
  return bcrypt.compareSync(passwordTry, this.password);
};

var User = mongoose.model('User', UserSchema);

module.exports = User;
