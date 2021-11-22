import { login, signup } from './helpers'

const users = {
  Mutation: {
    signup: (obj, args, context) => {
      return signup(obj, args, context, 'User')
    },
    login: (obj, args, context) => {
      return login(obj, args, context, 'User')
    },
  },
}

export default users
