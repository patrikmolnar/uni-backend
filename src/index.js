const env = require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server-express')
const { typeDefs } = require('./graphql/schema/typeDefs')
const { resolvers } = require('./graphql/resolvers/resolvers')
const express = require('express')
const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth')

const startServer = async () => {
	const app = express()

	const PORT = process.env.PORT
	
	app.use(isAuth)

	await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DBNAME}`, { useNewUrlParser: true, useFindAndModify: false });

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => ({ req, res }),
	});

	server.applyMiddleware({ app });

	app.listen({ port: PORT }, () =>
		console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	)

}

startServer();