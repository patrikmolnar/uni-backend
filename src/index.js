import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import dotenv from 'dotenv'

const isAuth = require('./middleware/is-auth')

const startServer = async () => {
	dotenv.config()
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