import z from 'zod'
/**
 {
     "product_id": 1,
  "invoice_id": "",
  "content": "Mẫu sản phẩm AB 11 1C",
  "rating": 5,
  "invoice_products_id": ""
}

 */

// Schema cho body
export const CreateReviewBody = z.object({
  product_id: z.coerce.number().int(),
  rating: z.number(),
  invoice_id: z.string(),
  invoice_products_id: z.string(),
  content: z.string()
})

// Schema cho insert

// Schema cho update (kế thừa từ create và thêm id)
export const UpdateReviewBody = CreateReviewBody.extend({})

export const ReviewItemSchema = z.object({
  id: z.coerce.number().int(),
  product_id: z.number(),
  invoice_id: z.number(),
  content: z.string(),
  rating: z.number(),
  invoice_products_id: z.number(),
  product_name: z.string()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const ReviewListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(ReviewItemSchema),
  first_page_url: z.string(),
  from: z.number().nullable(),
  last_page: z.number(),
  last_page_url: z.string(),
  links: z.array(PaginationLinkSchema),
  next_page_url: z.string().nullable(),
  path: z.string(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  to: z.number().nullable(),
  total: z.number()
})

export type ReviewItem = z.infer<typeof ReviewItemSchema>
export type ReviewListPag = z.infer<typeof ReviewListPagSchema>

export type CreateReviewBodyType = z.TypeOf<typeof CreateReviewBody>
export type UpdateReviewBodyType = z.TypeOf<typeof UpdateReviewBody>
