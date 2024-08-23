import * as z from "zod"

export const AssetWithGalleryAndTagsSchema = z.object({
  id: z.number().optional(),
  assetId: z.number(),
  editMode: z.boolean(),
  tags: z.array(z.string()).min(1, {
    message: "You must provide at least one tag",
  }),
  images: z
    .array(
      z.object({
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "Please wait for the image to upload",
        }),
        size: z.number(),
        key: z.string().optional(),
        id: z.number().optional(),
        name: z.string(),
      })
    )
    .min(1, { message: "You must provide at least one image" }),
})