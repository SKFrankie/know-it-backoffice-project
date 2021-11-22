import { login, signup } from './helpers'
import jwt from 'jsonwebtoken'

const superUsers = {
  Mutation: {
    superSignup: (obj, args, context) => {
      return signup(obj, args, context, 'SuperUser')
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
      CREATE (i: SuperUser {mail: $mail, RIGHT: $rights})
      RETURN i;
        `,
          { mail: args.mail, rights: args.rights }
        )
        .then((res) => {
          session.close()
          const { userId, mail } = res.records[0].get('i').properties
          const token = jwt.sign({ userId, mail }, process.env.JWT_SECRET, {
            expiresIn: '30d',
          })
          const url = process.env.ENDPOINT + '/super/invite/' + token
          return url
        })
    },
  },
}

export default superUsers
