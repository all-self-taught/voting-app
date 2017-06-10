var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var Account = require('./account').Account;

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    function(email, password, done) {
      Account.findOne({ email: email }, function(err, user) {
        if (err) { 
          console.log(err.message);
          return done(err); 
        }
        if (!user) {
          console.log('User not found');
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!bCrypt.compareSync(password, user.password)) {
          console.log('Incorrect password');
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
}