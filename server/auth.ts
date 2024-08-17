import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/server"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Credentials from 'next-auth/providers/credentials'
import { LoginSchema } from "@/types/LoginSchema"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm"
import { accounts, users } from "./schema"

 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  providers: [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true
    }),
    Github({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials)
        if(validatedFields.success){
          const { email, password } = validatedFields.data
          const user = await db.query.users.findFirst({
            where: eq(users.email, email)
          })
          if(!user || !user.password) return null

          const correctPassword = await compare(password, user.password)
          if(!correctPassword) return null
          return user
        } 
        return null
      }
    })
  ],
  callbacks: {
    async jwt({token}){
      if(!token.sub) return token
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub)
      })
      if(!existingUser) return token
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id)
      })
      token.isOAuth = !!existingAccount
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.image = existingUser.image
      return token
    },
    async session({session, token}){
      if (session && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.role) {
        session.user.role = token.role as string
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.image = token.image as string
      }
      return session
    }
  }
})