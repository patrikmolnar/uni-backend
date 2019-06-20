const bcrypt = require('bcryptjs') 
const env = require('dotenv')

const User = require('./models/user')
const University = require('./models/university')

env.config()
const jwt = require('jsonwebtoken')

export const resolvers = {
	Query: {
		users: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			const allUsers = await User.find()
			return allUsers.map(users => {
				return {
					...users._doc,
					_id: users.id,
					createdAt: new Date(users._doc.createdAt).toISOString(),
					updatedAt: new Date(users._doc.createdAt).toISOString()
				}
			});
		},
		user: (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			return User.findById(args.id)
		},
		userByType: (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			return User.find({ userType: args.userType })
		},
		universities: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			const allUnis = await University.find()
			return allUnis;
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
		createUser: async (_, args) => {

			const existingUser = await User.findOne({ email: args.input.email })

			if (existingUser) {
				throw new Error('User already exists!')
			}

			const hashedPassword = await bcrypt.hash(args.input.password, 12)
			
			const user = await new User({
				email: args.input.email,
				password: hashedPassword,
				firstName: args.input.firstName,
				lastName: args.input.lastName,
				userType: args.input.userType,
				university: '5d0b6e36cbe795c0608806ba'
			});	

			let createdUser;

			try {
				const result = await user.save()

				createdUser = {
					...result._doc,
					_id: result._doc._id,
					password: null,
					createdAt: new Date(result._doc.createdAt).toISOString(),
					updatedAt: new Date(result._doc.updatedAt).toISOString(),
					university: {
						_id: result._doc.university._id
					}
				}

				const university = await University.findById('5d0b6e36cbe795c0608806ba');

			if (!university) {
				throw new Error('University not found.');
			}

			university.users.push(user)
			await university.save();

			return createdUser;

			} catch (error) {
				throw error;
			}

		},
		createUniversity: (_, args) => {
			return University.findOne({ universityId: args.input.universityId }).then(uni => {
				if(uni){
					throw new Error('A University with this ID already exist!')
				}
				const university = new University({
					universityId: args.input.universityId,
					fullName: args.input.fullName,
					shortName: args.input.shortName,
					address: args.input.address,
					website: args.input.website,
					email: args.input.email,
					country: args.input.country
				});
				return university.save();
			})
		},
		updateUniversity: (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			return University.findOneAndUpdate({ _id: args._id }, args.input)
		},
		deleteUniversity: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			
			const res = await University.deleteOne({ _id: args._id })
			if(res.deletedCount === 1){
				return true
			} else if(res.deletedCount === 0) { 
				return false
			}
		},
		updateUser: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}

			let updatedUser;

			const hashedPassword = await bcrypt.hash(args.input.password, 12)

			updatedUser = {
				...args.input,
				password: hashedPassword
			}

			const user = await User.findOneAndUpdate({ _id: args._id }, updatedUser) 
		
			return { ...updatedUser, password: null, _id: args._id };
		},
		deleteUser: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			
			const res = await User.deleteOne({ _id: args._id })
			if(res.deletedCount === 1){
				return true
			} else if(res.deletedCount === 0) { 
				return false
			}
		}
	}
}