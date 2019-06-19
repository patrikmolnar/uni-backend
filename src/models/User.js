import mongoose from 'mongoose'

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
	}
});

export const User = mongoose.model('User', userSchema);