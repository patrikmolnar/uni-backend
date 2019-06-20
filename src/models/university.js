const mongoose = require('mongoose');

const Schema = mongoose.Schema

const universitySchema = new Schema({
	universityId: {
		type: String,
		required: true
	},
	fullName: {
		type: String,
		required: false
	},
	shortName: {
		type: String,
		required: false
	},
	address: {
		type: String,
		required: false
	},
	website: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: false
	},
	country: {
		type: String,
		required: false
	},
	users: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
}, { timestamps: true } )

module.exports = mongoose.model('University', universitySchema);