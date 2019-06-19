import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'
import dotenv from 'dotenv'

const startServer = async () => {
	dotenv.config()
	const app = express()

	const PORT = process.env.PORT

	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});
	
	server.applyMiddleware({ app });

	await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DBNAME}`, { useNewUrlParser: true, useFindAndModify: false });
	
	app.listen({ port: PORT }, () =>
		console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	)
	
}

startServer();