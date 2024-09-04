import type {
    BuildQueryResult,
    DBQueryConfig,
    ExtractTablesWithRelations,
  } from "drizzle-orm"
  import * as schema from "@/server/schema"
  
  type Schema = typeof schema
  type TSchema = ExtractTablesWithRelations<Schema>
  
  export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
    "one" | "many",
    boolean,
    TSchema,
    TSchema[TableName]
  >["with"]
  
  export type InferResultType<
    TableName extends keyof TSchema,
    With extends IncludeRelation<TableName> | undefined = undefined
  > = BuildQueryResult<
    TSchema,
    TSchema[TableName],
    {
      with: With
    }
  >
  export type AssetWithImagesAndTags = InferResultType<"assets",
    {assetImages:true, assetTags:true, favourites: true, reviews: true}  
  >

  export type ReviewWithUser = InferResultType<"reviews", 
    {user: true}
  >

  export type FavouritesWithAsset = InferResultType<"favourites", 
  {asset: {with: {assetImages: true , assetTags: true, favourites: true, reviews: true}}}
>

export type AssetWithFavouritesAndViews = InferResultType<"assets", 
  {favourites: true , views: true, assetImages: true}
>

export type OwnerProfile = InferResultType<"users">