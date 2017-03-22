var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config.js')

var app = express();

app.use(bodyParser.json());
app.use(cors())
app.use(session({ secret: config.sessionSecret }));
app.use(passport.initialize())
app.use(passport.session())

passport.use(new FacebookStrategy({
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));


//STEP JUST BEFORE THE USER IS ENTERED INTO THE SESSION
passport.serializeUser(function(user, done) {
  return done(null, user);
})

//STEP JUST BEFORE THE USER IS RETRIEVED FROM THE SESSION
passport.deserializeUser(function(user, done) {
  return done(null, user);
})

//END POINTS

app.get('/auth/facebook', passport.authenticate('facebook'))
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/me',failureRedirect:'/'
})
)
app.get("/me", function(req,res) {
	res.status(200).send(req.user);
})


app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})
