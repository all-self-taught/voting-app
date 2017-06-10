var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var mongoose = require('mongoose');
var app = express();

//app.use(express.logger());
app.use(express.static('bower_components'));
app.use(express.static('public'));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('cookie-parser')('your secret here'));

var session = require('express-session')

var MongoStore = require('connect-mongo')(session)

app.use(session({
  secret: 'your secret here',
  saveUninitialized: true,
  resave: true,
  // using store session on MongoDB using express-session + connect
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/vote-app',
    collection: 'sessions'
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//connect to local mongodb database
var db = mongoose.connect('mongodb://127.0.0.1:27017/vote-app');

//attach lister to connected event
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});

//use ejs to serve files
app.set('view engine', 'ejs');

//routes and login handler
require('./models/login')(passport);
require('./routes/routes')(app);

app.listen(8080, function(){
  console.log(("Express server listening on port " + app.get('port')))
});