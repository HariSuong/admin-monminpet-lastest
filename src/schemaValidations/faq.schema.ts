import z from 'zod'
/**
  "answer": "Động vật là gì?",
    "question": "Động vật là sinh vật sống có khả năng di chuyển, phản ứng với môi trường, ăn uống để duy trì sự sống và sinh sản.",
    "show": 1
 */

// Schema cho body
export const CreateFaqBody = z.object({
  answer: z.string().nullable(),
  question: z.string().nullable(),
  sort: z.coerce.number().int(),
  show: z.coerce.boolean()
})

// Schema cho req
export const CreateFaqReq = z.object({
  answer: z.string().nullable(),
  question: z.string().nullable(),
  sort: z.coerce.number().int(),
  show: z.coerce.number().int()
})

// Schema cho update (kế thừa từ create)
export const UpdateFaqBody = CreateFaqBody.extend({})
export const UpdateFaqReq = CreateFaqReq.extend({})

export const FaqParams = z.object({
  id: z.coerce.number()
})

/**
 * {
  "id": 1,
  "answer": "Hàm lượng calo của sản phẩm này?",
  "question": "Có 15 kcal/ thìa cà phê",
  "sort": 0,
  "show": 1
}

 */

// Type danh sách sản phẩm phân trang
export const FaqItemSchema = z.object({
  id: z.coerce.number().int(),
  answer: z.string().nullable(),
  question: z.string().nullable(),
  sort: z.coerce.number().int(),
  show: z.coerce.number().int()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const FaqListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(FaqItemSchema),
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

export type FaqItem = z.infer<typeof FaqItemSchema>
export type FaqListPag = z.infer<typeof FaqListPagSchema>

export type CreateFaqBodyType = z.TypeOf<typeof CreateFaqBody>
export type CreateFaqReqType = z.TypeOf<typeof CreateFaqReq>

export type UpdateFaqBodyType = z.TypeOf<typeof UpdateFaqBody>
export type UpdateFaqReqType = z.TypeOf<typeof UpdateFaqReq>

export type FaqParamsType = z.TypeOf<typeof FaqParams>
