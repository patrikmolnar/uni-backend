import { User } from './models/User'

export const resolvers = {
	Query: {
		users: () => User.find(),
		user: (_, args) => User.findById(args.id),
		userByType: (_, args) => User.find({ userType: args.userType }),
	},
	Mutation: {
		createUser: async (_, args) => {
			const user = new User(args.input);

			await user.save();
			return user;
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