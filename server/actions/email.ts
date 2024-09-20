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
      subject: "Confirm Email",
      html: `
        <style>
            body{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }
            @media (max-width: 500px) {
                a#cta{
                    width: 90%;
                    align-self: center;
                }
            }
        </style>
        <div id="container" style="margin: 0;padding:20px;">
            <img src="https://utfs.io/f/ez2eGPgh5yPHM5Prj6c3NBxZP5aJ7AY2cvuORGTeFW3sdnjq" alt="Marefiya logo" style="width: 100px;height: 50px;"/>
            <h1 style="margin: 0; padding-left: 20px;margin-top: 20px;font-size: 28px;font-weight: bold;">Welcome to Marefiya</h1>
            <p style="margin: 0;padding-left: 20px;margin-top: 10px;font-size: 16px;font-weight: lighter;">We are happy that you have joined our community, we have created your account you just have to confirm your email by clicking the button below.</p>
            <a href="${confirmLink}" 
                style="padding-left: 20px; text-decoration: none;padding: 15px 20px;background-color: blue;color: white;margin-top: 20px; display: inline-block;width: 40%;align-self: center;text-align: center;border-radius: 10px;"
                target="_blank"
                id="cta"
            >
                Confirm Email
            </a>
        </div>
      `,
    }
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          reject(error)
        } else {
          console.log("Email sent: ", info.response);
          resolve(info)
        }
      })
    })
}

export const sendPasswordResetEmail = async(email:string, token:string) => {
  const domain = getBaseURL()
  const confirmLink =  `${domain}/auth/password-reset?token=${token}`
  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: email,
    subject: "Forgot Password",
    html: `
      <style>
        body{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        @media (max-width: 500px) {
            a#cta{
                width: 90%;
                align-self: center;
            }
        }
      </style>
      <div id="container" style="margin: 0;padding:20px;">
        <img src="https://utfs.io/f/ez2eGPgh5yPHM5Prj6c3NBxZP5aJ7AY2cvuORGTeFW3sdnjq" alt="Marefiya logo" style="width: 100px;height: 50px;"/>
        <h1 style="margin: 0; padding-left: 20px;margin-top: 20px;font-size: 28px;font-weight: bold;">Reset your password</h1>
        <p style="margin: 0;padding-left: 20px;margin-top: 10px;font-size: 16px;font-weight: lighter;">If you requested to reset your password reset your password click the button below if you didn't ignore this Email.</p>
        <a href="${confirmLink}" 
            style="padding-left: 20px; text-decoration: none;padding: 15px 20px;background-color: blue;color: white;margin-top: 20px; display: inline-block;width: 40%;align-self: center;text-align: center;border-radius: 10px;"
            target="_blank"
            id="cta"
        >
            Reset Password
        </a>
      </div>
    `,
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
    subject: "Two Factor Authentication",
    html: `
      <style>
        body{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
      </style>
      <div id="container" style="margin: 0;padding:20px;">
          <img src="https://utfs.io/f/ez2eGPgh5yPHM5Prj6c3NBxZP5aJ7AY2cvuORGTeFW3sdnjq" alt="Marefiya logo" style="width: 100px;height: 50px;"/>
          <h1 style="margin: 0; padding-left: 20px;margin-top: 20px;font-size: 28px;font-weight: bold;">2FA Token</h1>
          <p style="margin: 0;padding-left: 20px;margin-top: 10px;font-size: 16px;font-weight: lighter;">You have tried to login into your account. Since your account is two factor authentication protected here is your 6 digit code.</p>
          <p style="margin: 0;padding-left: 20px;margin-top: 20px;font-weight: 400;letter-spacing: 5px;font-size: 22px;align-self: center;color: blue;">
              ${token}
          </a>
      </div>
    `,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  })
}