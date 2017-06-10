var passport = require('passport');
var Account = require('../models/account').Account;
var Poll = require('../models/account').Poll;
var Option = require('../models/account').Option;

module.exports = function(app){

	app.get('/', function(req, res){
    var username = req.user ? req.user.username : null;
		res.render('index', { user: req.isAuthenticated(), username: username });
	});

	app.get('/register', function(req, res){
    var username = req.user ? req.user.username : null;
		res.render('register', { user: req.isAuthenticated(), username: username, email: null, un: null, userexists: false, emailexists: false });
	});

	app.post('/register', function(req, res){
      require('../models/register')(req, res);
	});

	app.get('/login', function(req, res){
    var username = req.user ? req.user.username : null;
		res.render('login', { user: req.isAuthenticated(), username: username });
	});

	app.post('/login', 
		passport.authenticate('local', { failureRedirect: '/login' }), function(req, res){
		res.redirect('/' + req.user.username)
	});

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/'); //Can fire before session is destroyed?
  });

	app.get('/:user', function(req, res){
		if (req.isAuthenticated() && req.user.username == req.params.user){
			Account.findOne({ email: req.user.email }).populate('pollsInUser').exec(function(err, account){
				if (err) return err;

				res.render('dashboard', { user: req.isAuthenticated(), username: req.user.username, polls: account.pollsInUser });

			});
		} else {
      Account.findOne({ username: req.params.user }).populate('pollsInUser').exec(function(err, account){
        if (err) return err;
			  res.render('user', { user: req.isAuthenticated(), username: req.params.user, polls: account.pollsInUser });
      });
		}
	});

  app.get('/:user/new-poll', function(req, res){
    if (req.isAuthenticated() && req.user.username == req.params.user){
      res.render('new-poll', { user: req.isAuthenticated(), username: req.user.username, })
    } else {
      res.send('you\'re not logged in.');
    }
  });

  app.post('/:user/new-poll', function(req, res){
    if (req.isAuthenticated() && req.user.username == req.params.user){
      require('../models/new_poll')(req)
      res.redirect('/' + req.user.username);
    } else {
      res.send('you\'re not logged in.');
    }
  });

	app.get('/:user/:poll', function(req, res){
    // res.send(require('../models/poll')(req));
    Poll.findById(req.params.poll).populate('optionsInPoll').exec(function(err, poll){
      if (err) return err;
      res.render('poll', { user: req.isAuthenticated(), username: req.params.user, poll: poll });
    });
  });

  app.post('/:user/:poll', function(req, res){
    
    if (!(req.body.newoption)){
      Option.findById(req.body.option, function(err, option){
        option.count = option.count + 1;
        option.save(function(err){
          if (err) return err;
        });
      });
      res.redirect('/' + req.params.user + '/' + req.params.poll + '/results');
    } else {
      Poll.findById(req.params.poll, function(err, poll){
        var option = new Option({ option: req.body.newoption, count: 1});
        option.save(function(err){
          if (err) return err;
        });
        poll.optionsInPoll.push(option);
        poll.save(function(err){
          if (err) return err;
        })
      });
      res.redirect('/' + req.params.user + '/' + req.params.poll + '/results');
    }

  });

  app.delete('/:user/:poll', function(req, res){
    if (req.isAuthenticated() && req.user.username == req.params.user){
      Poll.findById(req.params.poll).remove().exec();
    } else {
      res.send('you\'re not logged in.');
    }

  });

  app.get('/:user/:poll/results', function(req, res){
    Poll.findById(req.params.poll).populate('optionsInPoll').exec(function(err, poll){
      if (err) return err;
      res.render('results', { user: req.isAuthenticated(), username:req.params.user, poll: JSON.stringify(poll) });
    });
  });
}

