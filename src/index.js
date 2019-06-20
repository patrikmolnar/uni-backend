const env = require('dotenv')
const { ApolloServer } = require('apollo-server-express')
const { gql } = require('apollo-server-express')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const express = require('express')
const mongoose = require('mongoose');

env.config()
const isAuth = require('./middleware/is-auth')

const startServer = async () => {
	const app = express()
	
	app.use(isAuth)

	const PORT = process.env.PORT

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: (isAuth) => (isAuth)
	});

	server.applyMiddleware({ app });

	await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DBNAME}`, { useNewUrlParser: true, useFindAndModify: false });
	
	app.listen({ port: PORT }, () =>
		console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	)
	
}

startServer();