var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Account = new Schema({
    username: String,
    email: String,
    password: String,
    pollsInUser: [{ type: Schema.Types.ObjectId, ref: 'Poll' }]
});

var pollSchema = new Schema({
	question: String,
	optionsInPoll: [{ type: Schema.Types.ObjectId, ref: 'Option' }]
});

var Poll = mongoose.model('Poll', pollSchema);

var optionSchema = new Schema({
	option: String,
	count: Number,
});

var Option = mongoose.model('Option', optionSchema);

module.exports = {
        Account: mongoose.model('Account', Account),
        Poll: Poll,
        Option: Option
    } 