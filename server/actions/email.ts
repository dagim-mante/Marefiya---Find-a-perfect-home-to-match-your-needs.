'use server'

import getBaseURL from '@/lib/base-url'
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});


export const sendVerificationEmail = async(email:string, token:string) => {
    const domain = getBaseURL()
    const confirmLink =  `${domain}/auth/verify-email?token=${token}`
    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: email,
      subject: "2FA Token",
      html: `<h3>Verify your account</h3><p>To verify your account click this <a href=${confirmLink}>link.</a></p>`,
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    })
}

export const sendPasswordResetEmail = async(email:string, token:string) => {
  const domain = getBaseURL()
  const confirmLink =  `${domain}/auth/password-reset?token=${token}`
  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: email,
    subject: "2FA Token",
    html: `<h3>Change your password</h3><p>To reset password click this <a href=${confirmLink}>link.</a></p>`,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  })
}

export const sendTwoFactorEmail = async(email:string, token:string) => {
  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: email,
    subject: "2FA Token",
    html: `<h3>Your 6 digit token is ${token}</h3>`,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  })
}