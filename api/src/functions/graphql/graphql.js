// This module can be used to serve the GraphQL endpoint
// as a lambda function

const { ApolloServer } = require('apollo-server-lambda')
import { Neo4jGraphQL } from '@neo4j/graphql'
import resolvers from '../../resolvers'
const neo4j = require('neo4j-driver')

// This module is copied during the build step
// Be sure to run `npm run build`
const { typeDefs } = require('./graphql-schema')

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  ),
  { encrypted: "ENCRYPTION_OFF"}
)

const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver,
  resolvers,
  config: {
    jwt: {
      secret: process.env.JWT_SECRET || 'secret',
    },
    database: process.env.NEO4J_DATABASE || 'neo4j',
  },
})

const server = new ApolloServer({
  schema: neoSchema.schema,
  context: ({ event }) => {
    return {
      driver,
      req: event,
      driverConfig: { database: process.env.NEO4J_DATABASE || 'neo4j' },
    }
  },
  introspection: true,
  playground: true,
})

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})
