const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
	firstName: {
		type: String,
		required: false
	},
	lastName: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	userType: {
		type: String,
		required: true
	},
	university: {
		type: Schema.Types.ObjectId,
		ref: 'University'
	}
});

module.exports = mongoose.model('User', userSchema);