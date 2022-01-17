import { compareSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID)

const getCurrentDate = () => {
  const today = new Date()
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  const dateTime = date + 'T' + time + 'Z'
  return dateTime
}

const getEndingDate = ({ years = 0, months = 0, days = 0, hours = 0 }) => {
  const today = new Date()
  const year = today.getFullYear() + years
  const month = today.getMonth() + months
  const day = today.getDate() + days
  const hour = today.getHours() + hours
  const date = new Date(year, month, day, hour)
  return dateToString(date)
}

const dateToString = (date) => {
  const strDate =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  const strTime =
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  const dateTime = strDate + 'T' + strTime + 'Z'
  return dateTime
}

const getFirstDayOfLastWeek = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) - 7
  const date = new Date(today.setDate(diff))
  return dateToString(date)
}

const getLastDayOfLastWeek = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1) - 7
  const date = new Date(today.setDate(diff + 6))
  return dateToString(date)
}

const getFirstDayOfWeek = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const date = new Date(today.setDate(diff))
  return dateToString(date)
}

const getLastDayOfWeek = () => {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  const date = new Date(today.setDate(diff + 6))
  return dateToString(date)
}

const signup = (obj, args, context, type = 'User', noPassword = false) => {
  if (!noPassword) {
    args.password = hashSync(args.password, 10) // remember if you change the 10 you have to do it everywhere maybe use a constant
  }
  const session = context.driver.session()

  return session
    .run(
      `
        CREATE (u:${type}) SET u += $args, u.userId = randomUUID(), u.createdAt=datetime('${getCurrentDate()}')
        RETURN u`,
      { args }
    )
    .then((res) => {
      session.close()
      const { userId, mail, rights } = res.records[0].get('u').properties

      return {
        token: jwt.sign(
          { userId, mail, roles: [rights] },
          process.env.JWT_SECRET,
          {
            expiresIn: '30d',
          }
        ),
      }
    })
    .catch((err) => {
      session.close()
      const error_message = err.message.includes('mail')
        ? 'Email already in use'
        : 'Username already in use :' + err.message
      throw new Error(error_message)
    })
}

const login = (obj, args, context, type = 'User', noPassword = false) => {
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
      const { userId, mail, rights, password } = res.records[0].get(
        'u'
      ).properties
      if (!noPassword && !compareSync(args.password, password)) {
        // is this the same password ?
        throw new Error('Authorization Error')
      }
      return {
        token: jwt.sign(
          { userId, mail, roles: [rights] },
          process.env.JWT_SECRET,
          {
            expiresIn: '30d',
          }
        ),
      }
    })
}

const googleVerify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_AUTH_CLIENT_ID,
  })
  const payload = ticket.getPayload()
  return payload
}

export {
  signup,
  login,
  getCurrentDate,
  getEndingDate,
  googleVerify,
  getFirstDayOfLastWeek,
  getLastDayOfLastWeek,
  getFirstDayOfWeek,
  getLastDayOfWeek,
}
