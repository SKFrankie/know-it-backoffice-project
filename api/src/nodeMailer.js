'use strict'
const nodemailer = require('nodemailer')

// async..await is not allowed in global scope, must use a wrapper
async function sendMail({ to, subject, text, html }) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: testAccount.user, // generated ethereal user
  //     pass: testAccount.pass, // generated ethereal password
  //   },
  // })

  let transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  })

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error)
    } else {
      console.log('Server is ready to take our messages')
    }
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Know It!" <${process.env.MAIL_USER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  })

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export async function sendResetPassword(mail, url) {
  const html = `<div><p>Hi, <a href=${url}>click here</a> to reset your Know It! password or just copy and paste this url:</p><p>${url}</p></div>`
  const subject = 'Know It! - Reset your password'
  await sendMail({ to: mail, html, subject })
}

export default sendMail
