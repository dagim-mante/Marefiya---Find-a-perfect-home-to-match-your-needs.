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
    index,
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from "next-auth/adapters"
import {createId} from '@paralleldrive/cuid2'
import { relations } from "drizzle-orm"
import AssetDetails from "@/app/assets/[id]/page"

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
  rentType: RentTypeEnum("rentType").default("month"),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull()
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

export const reviews = pgTable('reviews' , {
  id: serial('id').primaryKey(),
  rating: real('rating').notNull(),
  userId: text('userId').notNull().references(() => users.id, {onDelete: 'cascade'}),
  assetId: serial('assetId').notNull().references(() => assets.id, {onDelete: 'cascade'}),
  comment: text('comment').notNull(),
  created: timestamp('created').defaultNow()
}, (table) => {
    return {
      assetIdx: index('assetIdx').on(table.assetId),
      userIdx: index('userIdx').on(table.userId)
    }
})

export const favourites = pgTable('favourites', {
  id: serial("id").primaryKey(),
  assetId: serial("assetId").notNull().references(() => assets.id, {onDelete: 'cascade'}),
  userId: text("userId").notNull().references(() => users.id, {onDelete: 'cascade'}),
  created: timestamp("created").defaultNow()
})

export const views = pgTable("views", {
  id: serial("id").primaryKey(),
  assetId: serial("assetId").notNull().references(() => assets.id, {onDelete: 'cascade'}),
  ip: text("ip").notNull(),
  created: timestamp("created").defaultNow()
})

export const viewsRelations = relations(views, ({one}) => ({
  asset: one(assets, {
    fields: [views.assetId],
    references: [assets.id]
  })
}))

export const favouritesRelations = relations(favourites, ({one}) => ({
  user: one(users, {
    fields: [favourites.userId],
    references: [users.id]
  }),
  asset: one(assets, {
    fields: [favourites.assetId],
    references: [assets.id]
  })
}))

export const reviewRelations = relations(reviews, ({one}) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  }),
  asset: one(assets, {
    fields: [reviews.assetId],
    references: [assets.id]
  })
}))

export const userRelations = relations(users, ({many}) => ({
  reviews: many(reviews),
  favourites: many(favourites)
}))

export const assetRelations = relations(assets, ({many}) => ({
  assetImages: many(assetImages),
  assetTags: many(assetTags),
  reviews: many(reviews),
  favourites: many(favourites),
  views: many(views)
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