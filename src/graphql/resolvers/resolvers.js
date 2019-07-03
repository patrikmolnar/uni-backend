const bcrypt = require('bcryptjs') 
const env = require('dotenv').config()

const User = require('../../models/user')
const University = require('../../models/university')

const jwt = require('jsonwebtoken')

const { 
	formatDate, 
	users, 
	includeNestedUniversity 
} = require('../../utils/utils')


export const resolvers = {
	Query: {
		users: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			const allUsers = await User.find()
			return allUsers.map(users => {
				return includeNestedUniversity(users)
			});
		},

		user: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			const user = await User.findById(args._id)
			return includeNestedUniversity(user)
		},

		userByType: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			const users = await User.find({ userType: args.userType })
			return users.map(user => {
				return includeNestedUniversity(user)
			})
		},

		universities: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			const allUnis = await University.find()
			return allUnis.map(uni => {
				return {
					...uni._doc,
					_id: uni.id,
					users: users.bind(this, uni._doc.users)
				}
			})
		},

		login: async (_, args) => {
			const user = await User.findOne({ email: args.email })
			if(!user){
				throw new Error('User does not exist!');
			}
			const isEqual = await bcrypt.compare(args.password, user.password);
			if(!isEqual){
				throw new Error('Incorrect login credentials!');
			}
			const token = jwt.sign({
				userId: user.id,
				email: user.email,
				userType: user.userType,
			}, process.env.JWT_VALIDATOR_KEY, {
				expiresIn: '1hr'
			})
			return { userId: user.id, token: token, tokenExpiration: 1, userType: user.userType }
		}
	},

	Mutation: {
		createUser: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			if(context.req.userType !== 'ADMIN'){
				throw new Error(`You don't have permissions to create users!`)
			}

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
					createdAt: formatDate.bind(this, result._doc.createdAt),
					updatedAt: formatDate.bind(this, result._doc.updatedAt),
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

		createUniversity: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			if(context.req.userType !== 'ADMIN'){
				throw new Error(`You don't have permissions to create universities!`)
			}

			try {
				const uni = await University.findOne({ universityId: args.input.universityId })

				if(uni){
					throw new Error('A University with this ID already exist!')
				}

				const university = await new University({
					universityId: args.input.universityId,
					fullName: args.input.fullName,
					shortName: args.input.shortName,
					address: args.input.address,
					website: args.input.website,
					email: args.input.email,
					country: args.input.country
				});

				await university.save();

				return university
			} 
			catch (err) {
				throw err;
			}
		},

		updateUniversity: (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			if(context.req.userType !== 'ADMIN'){
				throw new Error(`You don't have permissions to update universities!`)
			}

			return University.findOneAndUpdate({ _id: args._id }, args.input)
		},
		
		deleteUniversity: async (_, args, context) => {
			if(!context.req.isAuth) {
				throw new Error('Unauthenticated!')
			}
			if(context.req.userType !== 'ADMIN'){
				throw new Error(`You don't have permissions to delete!`)
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
			if(context.req.userType !== 'ADMIN'){
				throw new Error(`You don't have permissions to update users!`)
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
			if(context.req.userType !== 'ADMIN'){
				throw new Error(`You don't have permissions to delete users!`)
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