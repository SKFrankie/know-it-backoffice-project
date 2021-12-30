import { googleVerify, login, signup, getCurrentDate } from './helpers'

const users = {
  Mutation: {
    signup: (obj, args, context) => {
      args = {
        coins: 0,
        stars: 0,
        starPercentage: 0,
        isPremium: false,
        ...args,
      }
      return signup(obj, args, context, 'User')
    },
    googleSignup: async (obj, args, context) => {
      args = {
        coins: 0,
        stars: 0,
        starPercentage: 0,
        isPremium: false,
        ...args,
      }
      const payload = await googleVerify(args.token).catch((err) => {
        throw new Error('Google verification failed')
      })
      return signup(
        obj,
        { ...args, mail: payload.email, username: payload.given_name },
        context,
        'User',
        true
      )
    },
    googleLogin: async (obj, args, context) => {
      const payload = await googleVerify(args.token).catch((err) => {
        throw new Error('Google verification failed')
      })
      return login(obj, { ...args, mail: payload.email }, context, 'User', true)
    },
    login: (obj, args, context) => {
      return login(obj, args, context, 'User')
    },
    updateCurrentUser: (obj, args, context) => {
      const session = context.driver.session()
      return session
        .run(
          `MATCH (u:User {userId: $auth.jwt.userId})
          SET u += $args
          RETURN u`,
          { args, auth: context.auth }
        )
        .then((res) => {
          session.close()
          return res.records[0].get('u').properties
        })
        .catch((err) => {
          session.close()
          throw new Error(err)
        })
    },
    updateLastSeen: (obj, args, context) => {
      const session = context.driver.session()
      return session
        .run(
          `MATCH (u:User {userId: $auth.jwt.userId})
          SET u += $args, u.lastSeen=datetime('${getCurrentDate()}')
          RETURN u`,
          { args, auth: context.auth }
        )
        .then((res) => {
          session.close()
          return res.records[0].get('u').properties
        })
        .catch((err) => {
          session.close()
          throw new Error(err)
        })
    },
  },
}

export default users
