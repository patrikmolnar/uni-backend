import { User } from './models/User'
import bcrypt from 'bcryptjs'

export const resolvers = {
	Query: {
		users: () => User.find(),
		user: (_, args) => User.findById(args.id),
		userByType: (_, args) => User.find({ userType: args.userType }),
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

		updateUser: (_, args) =>  User.findOneAndUpdate({ _id: args.id }, args.input),
		deleteUser: async (_, args) => {
			const res = await User.deleteOne({ _id: args.id })
			if(res.deletedCount === 1){
				return true
			} else if(res.deletedCount === 0) { 
				return false
			}
		}
	}
}