import users from './users'
import superUsers from './superUsers'

const resolvers = {
  Mutation: { ...superUsers.Mutation, ...users.Mutation },
}

export default resolvers
