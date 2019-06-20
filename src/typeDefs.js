import { gql } from 'apollo-server-express'

export const typeDefs = gql`
	type Query {
		users: [User]
		user(_id:ID!): User
		userByType(userType: UserType): [User]
		login(email: String!, password: String!): AuthData!
		universities: [University]
	}

	type Mutation {
		createUser(input: UserInput): User
		updateUser(_id: ID!, input: UserInput): User
		deleteUser(_id: ID!): Boolean
		createUniversity(input: UniversityInput): University
		updateUniversity(_id: ID!, input: UniversityInput): University
		deleteUniversity(_id: ID!): Boolean
	}

	type AuthData {
		userId: ID!
		token: String!
		tokenExpiration: Int!
	}

	type University {
		_id: ID!
		universityId: String!
		fullName: String
		shortName: String
		address: String
		website: String
		email: String
		country: String
		users: [User!]
	}

	type User {
		_id: ID!
		firstName: String
		lastName: String
		email: String
		password: String
		userType: UserType
		university: University
	}

	enum UserType {
		ADMIN
		STUDENT
		DEPARTMENT_STAFF
		FINANCE_STAFF
	}

	input UserInput {
		firstName: String
		lastName: String
		email: String!
		password: String!
		userType: UserType
	}

	input UniversityInput {
		universityId: String
		fullName: String
		shortName: String
		address: String
		website: String
		email: String
		country: String
	}
`
