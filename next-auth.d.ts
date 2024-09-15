import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendUser = DefaultSession["user"] & {
  id: string
  role: string
  isTwoFactorEnabled: boolean
  isOAuth: boolean
  image: string
  bio: string | null
}

declare module "next-auth" {
  interface Session {
    user: ExtendUser
  }
}