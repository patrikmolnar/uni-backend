import { gql } from 'apollo-server-express'

export const typeDefs = gql`
	type Query {
		users: [User]
		user(id:ID): User
		userByType(userType: UserType): [User]
	}

	type Mutation {
		createUser(firstName: String, lastName: String, email: String, password: String, userType: UserType): User!
		updateUser(id: ID, firstName: String, lastName: String, email: String, password: String, userType: UserType): User!
		deleteUser(id: ID): Boolean
	}

	type User {
		id: ID!
		firstName: String
		lastName: String
		email: String
		password: String
		userType: UserType
	}

	enum UserType {
		ADMIN
		STUDENT
		TEACHER
		INTERNAL
	}

	input createUserInput {
		firstName: String
		lastName: String
		email: String
		password: String
		userType: UserType
	}
`
