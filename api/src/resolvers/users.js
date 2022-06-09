import jwt from 'jsonwebtoken'
import {
  googleVerify,
  login,
  signup,
  getCurrentDate,
  getEndingDate,
  getFirstDayOfLastWeek,
  getLastDayOfLastWeek,
  getFirstDayOfWeek,
  getLastDayOfWeek,
} from './helpers'
import { hashSync } from 'bcrypt'

import { sendResetPassword } from '../nodeMailer'

const users = {
  Mutation: {
    signup: (obj, args, context) => {
      args = {
        coins: 0,
        stars: 0,
        starPercentage: 0,
        ...args,
      }
      return signup(obj, args, context, 'User')
    },
    googleSignup: async (obj, args, context) => {
      args = {
        coins: 0,
        stars: 0,
        starPercentage: 0,
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
    changePassword: (obj, args, context) => {
      const password = hashSync(args.newPassword, 10) // remember if you change the 10 you have to do it everywhere maybe use a constant
      const session = context.driver.session()

      return session
        .run(
          `MATCH (u:User {userId: $auth.jwt.userId})
          SET u.password = $password
          RETURN u LIMIT 1
        `,
          { args, auth: context.auth, password }
        )
        .then((res) => {
          session.close()
          return true
        })
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
    getPremium(obj, args, context) {
      const session = context.driver.session()
      const endingDate = getEndingDate(args)
      return session
        .run(
          `MATCH (u:User {userId: $auth.jwt.userId})
        SET u.premiumEndingDate = datetime('${endingDate}')
        RETURN u`,
          { auth: context.auth }
        )
        .then((res) => {
          session.close()
          return true
        })
        .catch((err) => {
          session.close()
          throw new Error(err)
        })
    },
    setPremiumMultipleUsers(obj, args, context) {
      const session = context.driver.session()
      return session
        .run(
          `
        MATCH (s:SuperUser {userId: "${context.auth.jwt.userId}"})
        WHERE s.rights in ['ADMIN']
        MATCH (u:User) WHERE u.userId IN $userIds
        SET u.premiumEndingDate = datetime('${args.endingDate}')
        RETURN u`,
          { userIds: args.userIds }
        )
        .then((res) => {
          session.close()
          return true
        })
        .catch((err) => {
          session.close()
          throw new Error(err)
        })
    },
    resetPassword: (obj, args, context) => {
      const session = context.driver.session()

      return session
        .run(`MATCH (u:User) WHERE u.mail=$mail RETURN u`, {
          mail: args.mail,
        })
        .then((res) => {
          session.close()
          const { userId, mail, tpo } = res.records[0].get('u').properties
          // we don't let the user reset his password if he's a tpo (meaning he signed up with google etc ...)
          if (tpo) {
            throw new Error(
              'You can not reset your password if you signed up with google'
            )
          }
          const token = jwt.sign({ userId, mail }, process.env.JWT_SECRET, {
            expiresIn: '3d',
          })
          const url = process.env.KNOW_IT_URL + '/reset-password/' + token
          await sendResetPassword(mail, url)
          return true
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
      return ranking(
        obj,
        args,
        context,
        getFirstDayOfLastWeek(),
        getLastDayOfLastWeek()
      )
    },
    currentRankingUsers(obj, args, context) {
      return ranking(
        obj,
        args,
        context,
        getFirstDayOfWeek(),
        getLastDayOfWeek()
      )
    },
  },
}

const ranking = (obj, args, context, firstDay, lastDay) => {
  const session = context.driver.session()
  const limit = args.limit ? `LIMIT apoc.convert.toInteger(${args.limit})` : ''
  const skip = args.offset ? `SKIP apoc.convert.toInteger(${args.offset})` : ''
  return session
    .run(
      `
        MATCH (u:User)
        WHERE datetime('${firstDay}') < u.lastRankingDate AND  u.lastRankingDate < datetime('${lastDay}')
        OPTIONAL MATCH (a:Avatar)-[:AVATAR_USER]->(u:User)
        RETURN u,a
        ORDER BY u.points DESC
        ${skip}
        ${limit}
      `,
      { args }
    )
    .then((res) => {
      session.close()
      return res.records.map((record) => {
        const user = record.get('u').properties
        const avatar = record.get('a')
        if (avatar) {
          user.currentAvatar = avatar.properties
        }
        return record.get('u').properties
      })
    })
    .catch((err) => {
      session.close()
      throw new Error(err)
    })
}

export default users
