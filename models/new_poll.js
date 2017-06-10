var Poll = require('./account').Poll
var Option = require('./account').Option
var Account = require('./account').Account

module.exports = function(req){

	Account.findOne({ email: req.user.email }, function(err, account){
	
		var poll = new Poll({ question: req.body.question });

		for(var opt of req.body.options){
			var option = new Option({ option: opt, count: 0 });
			option.save(function(err){
				if (err) return err;
			});
			poll.optionsInPoll.push(option);
		}

		poll.save(function(err){
			if (err) return err;
		});

		account.pollsInUser.push(poll);
		account.save(function(err){
			if (err) return err;
		});

	});
}