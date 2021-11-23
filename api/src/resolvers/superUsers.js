import { login, signup } from './helpers'
import jwt from 'jsonwebtoken'
import { compareSync, hashSync } from 'bcrypt'

const superUsers = {
  Mutation: {
    superSignup: (obj, args, context) => {
      args.password = hashSync(args.password, 10)
      const session = context.driver.session()

      const token = args.token
      delete args.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const userId = decoded.userId

      // We need to check if the user is already in the database from the front to prevent him to change his password/info with same token

      return session
        .run(
          `
        MATCH (u:SuperUser {userId: $userId}) SET u += $args
        RETURN u`,
          { userId, args }
        )
        .then((res) => {
          session.close()
          const { userId, mail } = res.records[0].get('u').properties

          return {
            token: jwt.sign({ userId, mail }, process.env.JWT_SECRET, {
              expiresIn: '30d',
            }),
          }
        })
        .catch((err) => {
          session.close()
          throw new Error(err)
        })
    },
    superLogin: (obj, args, context) => {
      return login(obj, args, context, 'SuperUser')
    },
    inviteSuperUser: (obj, args, context) => {
      const session = context.driver.session()

      return session
        .run(
          `
      MATCH (u:SuperUser {userId: "${context.auth.jwt.userId}"})
      WHERE u.rights in ['ADMIN']
      CREATE (i: SuperUser {mail: $mail, RIGHT: $rights, userId: randomUUID()})
      RETURN i;
        `,
          { mail: args.mail, rights: args.rights }
        )
        .then((res) => {
          session.close()
          const { userId, mail } = res.records[0].get('i').properties
          const token = jwt.sign({ userId, mail }, process.env.JWT_SECRET, {
            expiresIn: '3d',
          })
          const url = process.env.ENDPOINT + '/super/invite/' + token
          return url
        })
    },
  },
}

export default superUsers
