import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import { typeDefs } from './typeDefs'
import { resolvers } from './resolvers'


const startServer = async () => {
	const app = express()

	const PORT = process.env.PORT || 4000

	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});
	
	server.applyMiddleware({ app });

	await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useFindAndModify: false });
	
	app.listen({ port: PORT }, () =>
		console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	)
	
}

startServer();