var Account = require('./account').Account;
var crypt = require('./crypt');

module.exports = function(req, res){
// find a user in Mongo with provided username
  
  var username = req.user ? req.user.username : null;
  
  Account.findOne({'email': req.body.email}, function(err, user) {
    // In case of any error return
    if (err){
      console.log('Error in SignUp: '+err);
      return res.send(err);
    }
    // already exists
    if (user) {
      console.log('User already exists');
      res.render('register', { user: req.isAuthenticated(), username: username, un: req.body.username, email: req.body.email, userexists: false, emailexists: true });
    } else {

      Account.findOne({'username': req.body.username}, function(err, username){
        if (username) {
          console.log('Username taken');
          res.render('register', { user: req.isAuthenticated(), username: username, un: req.body.username, email: req.body.email,  userexists: true, emailexists: false });
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new Account();
          // set the user's local credentials
          newUser.username = req.body.username;
          newUser.email = req.body.email;
          newUser.password = crypt.createHash(req.body.password);

          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful'); 
            var username = req.user ? req.user.username : null;   
            res.render('login', { user: req.isAuthenticated(), username: username });
          });  
        }
      });      
    }
  });
}