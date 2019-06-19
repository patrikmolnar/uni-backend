import { User } from './models/user'
import bcrypt from 'bcryptjs'

const jwt = require('jsonwebtoken')

export const resolvers = {
	Query: {
		users: (_, req) => {
			if(!req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			return User.find()
		},
		user: (_, args, req) => {
			if(!req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			return User.findById(args.id)
		},
		userByType: (_, args, req) => {
			if(!req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			return User.find({ userType: args.userType })
		},
		login: async (_, args) => {
			const user = await User.findOne({ email: args.email })
			if(!user){
				throw new Error('User does not exist!');
			}
			const isEqual = await bcrypt.compare(args.password, user.password);
			if(!isEqual){
				throw new Error('Password is incorrect!'); // change error later to not give away direct hints 
			}
			const token = jwt.sign({
				userId: user.id,
				email: user.email
			}, process.env.JWT_VALIDATOR_KEY, {
				expiresIn: '1hr'
			}) // change key to env variable
			return { userId: user.id, token: token, tokenExpiration: 1 }
		}
	},
	Mutation: {
		createUser: (_, args) => {
			return User.findOne({ email: args.input.email }).then(user => {
				if (user) {
					throw new Error('User already exists!')
				}
				return bcrypt
				.hash(args.input.password, 12)
			})
			.then(hashedPassword => {
				const user = new User({
					email: args.input.email,
					password: hashedPassword,
					firstName: args.input.firstName,
					lastName: args.input.lastName,
					userType: args.input.userType
				});
				return user.save();
			})
			.then(result => {
				return { ...result._doc, password: null, id: result.id };
			})
			.catch(err => {
				throw err;
			})
		},
		updateUser: (_, args, req) => {
			if(!req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			return User.findOneAndUpdate({ _id: args.id }, args.input)
		},
		deleteUser: async (_, args, req) => {
			if(!req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			
			const res = await User.deleteOne({ _id: args.id })
			if(res.deletedCount === 1){
				return true
			} else if(res.deletedCount === 0) { 
				return false
			}
		}
	}
}