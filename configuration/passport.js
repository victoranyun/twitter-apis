var TwitterStrategy = require('passport-twitter');
var config = require('./config');
var request = require('request');

 module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    passport.use(
    new TwitterStrategy(
    {
        consumerKey: config.consumer_key,
        consumerSecret: config.consumer_secret,
        callbackURL: config.callback_url,
    },
    function(token, tokenSecret, profile, cb) {
        console.log(token);
        console.log(tokenSecret);
        return cb(null, profile);
    }));
 };