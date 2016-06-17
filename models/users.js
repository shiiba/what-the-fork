var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var recipeSchema = require('./recipes.js').schema;

var userSchema = new mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, unique: true, require: true },
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

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = User;
