import { compareSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'

const signup = (obj, args, context, type = 'User') => {
  args.password = hashSync(args.password, 10)
  const session = context.driver.session()

  return session
    .run(
      `
        CREATE (u:${type}) SET u += $args, u.userId = randomUUID()
        RETURN u`,
      { args }
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
      const error_message = err.message.includes('mail')
        ? 'Email already in use'
        : 'Username already in use'
      throw new Error(error_message)
    })
}

const login = (obj, args, context, type = 'User') => {
  const session = context.driver.session()

  return session
    .run(
      `
        MATCH (u:${type} {mail: $mail})
        RETURN u LIMIT 1 
        `,
      { mail: args.mail }
    )
    .then((res) => {
      session.close()
      const { userId, mail, password } = res.records[0].get('u').properties
      if (!compareSync(args.password, password)) {
        // is this the same password ?
        throw new Error('Authorization Error')
      }
      return {
        token: jwt.sign({ userId, mail }, process.env.JWT_SECRET, {
          expiresIn: '30d',
        }),
      }
    })
}
export { signup, login }
