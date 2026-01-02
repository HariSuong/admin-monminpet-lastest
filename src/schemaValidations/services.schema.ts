import z from 'zod'

// Schema cho body

export const CreateServiceBody = z.object({
  thumb: z.string().optional(),
  name: z.string().min(1).max(256),
  desc: z.string().max(1000).optional(),
  content: z.string().optional(),
  sub_content: z.string().optional(),
  show: z.boolean().optional(),
  hot: z.boolean().optional(),
  order: z.number().int().optional(),
  faqs: z.array(z.number()).optional(),
  inside: z.number().optional(), // id menu cha
  display_type: z.number() // 2 bài viết, 3 sản phẩm, 4 dịch vụ
})
export const CreateServiceReq = z.object({
  thumb: z.string().optional(),
  name: z.string().min(1).max(256),
  desc: z.string().max(1000).optional(),
  content: z.string().optional(),
  sub_content: z.string().optional(),
  show: z.boolean().optional(),
  hot: z.boolean().optional(),
  order: z.number().int().optional(),
  faqs: z.array(z.number()).optional(),
  inside: z.number().optional(), // id menu cha
  display_type: z.number() //
})

// Schema cho update body
export const UpdateServiceBody = CreateServiceBody.extend({})
// Schema cho update req
export const UpdateServiceReq = CreateServiceReq.extend({})

export const ServiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const ServiceRes = z.object({
  data: ServiceSchema,
  message: z.string()
})

export const ServiceListRes = z.object({
  data: z.array(ServiceSchema),
  message: z.string()
})

export const ServiceParams = z.object({
  id: z.coerce.number()
})

/**
 *          
            "translate": null,
            "type_thumb_video": "thumb",
            "video": "",
            "created_at": null,
            "updated_at": "2025-04-08T04:51:43.000000Z",
            "faqs": "28,29,30"
 */
// Type danh sách bài viết phân trang
export const ServiceItemSchema = z.object({
  id: z.number(),
  icon: z.string(),
  thumb: z.string(),
  name: z.string().max(256),
  desc: z.string().max(1000),
  content: z.string(),
  sub_content: z.string().optional(),
  keywords: z.string(),
  show: z.boolean(),
  hot: z.boolean(),
  order: z.number().int(),
  inside: z.number(), // id menu cha
  display_type: z.string(),
  translate: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  faqs: z.string(),
  faq_questions: z.string(),
  inside_name: z.string()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const ServiceListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(ServiceItemSchema),
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

export type ServiceItem = z.infer<typeof ServiceItemSchema>
export type ServiceListPag = z.infer<typeof ServiceListPagSchema>

export type ServiceListResType = z.TypeOf<typeof ServiceListRes>
export type CreateServiceBodyType = z.TypeOf<typeof CreateServiceBody>
export type CreateServiceReqType = z.TypeOf<typeof CreateServiceReq>

export type UpdateServiceBodyType = z.TypeOf<typeof UpdateServiceBody>
export type UpdateServiceReqType = z.TypeOf<typeof UpdateServiceReq>

export type ServiceResType = z.TypeOf<typeof ServiceRes>
export type ServiceParamsType = z.TypeOf<typeof ServiceParams>
