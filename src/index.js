const env = require('dotenv').config()
const { ApolloServer } = require('apollo-server-express')
const { ApolloEngine } = require('apollo-engine')
const { gql } = require('apollo-server-express')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const express = require('express')
const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth')

const startServer = async () => {
	const app = express()
	
	app.use(isAuth)

	const engine = new ApolloEngine({
		apiKey: process.env.ENGINE_API_KEY
	})

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		tracing: true,
		cacheControl: true,
		engine: false,
		context: (isAuth) => (isAuth),
	});

	server.applyMiddleware({ app });

	await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DBNAME}`, { useNewUrlParser: true, useFindAndModify: false });

	engine.listen({
		port: process.env.PORT,
		graphqlPaths: ['/graphql'],
		expressApp: app,
		launcherOptions: {
			startupTimeout: 3000
		},
	}, () => {
		console.log('Server started...')
	})	
}

startServer();