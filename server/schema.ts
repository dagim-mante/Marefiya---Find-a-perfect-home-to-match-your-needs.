import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    pgEnum,
    serial,
    real,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import {createId} from '@paralleldrive/cuid2'
import { relations } from "drizzle-orm"

export const RoleEnum = pgEnum("roles", ["user", "owner", "admin"])
export const AssetTypeEnum = pgEnum("type", ["rent", "sell"])
export const RentTypeEnum = pgEnum("rentType", ["night", "week", "month"])
   
export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    twoFactorEnabled: boolean("twofactorEnabled").default(false),
    role: RoleEnum("roles").default("user")
})
   
export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const emailTokens = pgTable(
    "email_token",
    {
      id: text("id").notNull().$defaultFn(() => createId()),
      email: text("email").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    })
)

export const passwordResetTokens = pgTable(
    "password_reset_token",
    {
      id: text("id").notNull().$defaultFn(() => createId()),
      email: text("email").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    })
)

export const twoFactorTokens = pgTable(
    "two_factor_token",
    {
      id: text("id").notNull().$defaultFn(() => createId()),
      email: text("email").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      userId: text("userId").references(() => users.id, {onDelete: 'cascade'})
    },
    (verificationToken) => ({
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    })
)



export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  owner: text("owner")
          .notNull()
          .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  created: timestamp("created").defaultNow(),
  type: AssetTypeEnum("type").default("rent"),
  rentType: RentTypeEnum("rentType").default("month")
})

export const assetImages = pgTable("assetImages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: real("order").notNull(),
  assetId: serial("assetId").notNull().references(() => assets.id, {onDelete: 'cascade'})
})

export const assetTags = pgTable("assetTags", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  assetId: serial("assetId").notNull().references(() => assets.id, {onDelete: 'cascade'})
})

export const assetRelations = relations(assets, ({many}) => ({
  assetImages: many(assetImages),
  assetTags: many(assetTags)
}))

export const assetImagesRelations = relations(assetImages, ({one}) => ({
  assets: one(assets, {
    fields: [assetImages.assetId],
    references: [assets.id],
  })
}))

export const assetTagsRelations = relations(assetTags, ({one}) => ({
  assets: one(assets, {
    fields: [assetTags.assetId],
    references: [assets.id],
  })
}))