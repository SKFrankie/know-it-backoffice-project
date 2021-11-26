import { login, signup } from './helpers'

const users = {
  Mutation: {
    signup: (obj, args, context) => {
      args = { coins: 0, tickets: 0, isPremium: false, ...args }
      return signup(obj, args, context, 'User')
    },
    login: (obj, args, context) => {
      return login(obj, args, context, 'User')
    },
  },
}

export default users
