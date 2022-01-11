import users from './users'
import superUsers from './superUsers'

const resolvers = {
  Mutation: { ...superUsers.Mutation, ...users.Mutation },
  Query: { ...superUsers.Query, ...users.Query },
}

export default resolvers
