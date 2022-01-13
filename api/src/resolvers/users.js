import {
  googleVerify,
  login,
  signup,
  getCurrentDate,
  getFirstDayOfLastWeek,
  getLastDayOfLastWeek,
} from './helpers'

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
        tpo: true,
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
    updatePoints: (obj, args, context) => {
      const session = context.driver.session()
      return session
        .run(
          `MATCH (u:User {userId: $auth.jwt.userId})
          SET u += $args, u.lastRankingDate=datetime('${getCurrentDate()}')
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
    setUsersGifts(obj, args, context) {
      const session = context.driver.session()
      // when a users is logged in, we check if it's time to update people gifts for this week
      return session
        .run(
          `MATCH (user:User)
          MATCH (u:User {userId: $auth.jwt.userId})
          OPTIONAL MATCH (first:User {userId: $args.first})
          OPTIONAL MATCH (second:User {userId: $args.second})
          OPTIONAL MATCH (third:User {userId: $args.third})
          SET user.lastRankingGiftDate = datetime('${getCurrentDate()}'), user.rankingGift = 0
          SET first.rankingGift = 1, second.rankingGift = 2, third.rankingGift = 3
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
  Query: {
    rankingUsers: (obj, args, context) => {
      // get last week ranking
      const session = context.driver.session()
      return session
        .run(
          `
        MATCH (u:User)
        WHERE datetime('${getFirstDayOfLastWeek()}') < u.lastRankingDate AND  u.lastRankingDate < datetime('${getLastDayOfLastWeek()}')
        RETURN u
        ORDER BY u.points DESC
        SKIP apoc.convert.toInteger($skip)
        LIMIT  apoc.convert.toInteger($limit)
      `,
          { limit: args.limit || 50, skip: args.offset || 0 }
        )
        .then((res) => {
          session.close()
          return res.records.map((record) => {
            return record.get('u').properties
          })
        })
        .catch((err) => {
          session.close()
          throw new Error(err)
        })
    },
  },
}

export default users
