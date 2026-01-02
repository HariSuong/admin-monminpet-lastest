import z from 'zod'

// Schema cho body

export const CreateMenuBody = z.object({
  thumb: z.string().optional(),
  name: z.string().min(1).max(256),
  desc: z.string().optional(),
  // content: z.string().optional(),
  // keywords: z.string().optional(),
  show: z.boolean().optional(),
  hot: z.boolean().optional(),
  order: z.number().int().optional(),
  // faqs: z.array(z.number()).optional(),
  inside: z.number().optional(), // id menu cha
  display_type: z.number() // 2 bài viết, 3 sản phẩm, 4 dịch vụ
})
export const CreateMenuReq = z.object({
  thumb: z.string().optional(),
  name: z.string().min(1).max(256),
  desc: z.string().optional(),
  // content: z.string().optional(),
  // keywords: z.string().optional(),
  show: z.boolean().optional(),
  hot: z.boolean().optional(),
  order: z.number().int().optional(),
  // faqs: z.array(z.number()).optional(),
  inside: z.number().optional(), // id menu cha
  display_type: z.number() //
})

// Schema cho update body
export const UpdateMenuBody = CreateMenuBody.extend({})
// Schema cho update req
export const UpdateMenuReq = CreateMenuReq.extend({})

export const MenuSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const MenuRes = z.object({
  data: MenuSchema,
  message: z.string()
})

export const MenuListRes = z.object({
  data: z.array(MenuSchema),
  message: z.string()
})

export const MenuParams = z.object({
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
export const MenuItemSchema = z.object({
  id: z.number(),
  icon: z.string(),
  thumb: z.string(),
  name: z.string().max(256),
  desc: z.string().max(1000),
  content: z.string(),
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

export const MenuListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(MenuItemSchema),
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

export type MenuItem = z.infer<typeof MenuItemSchema>
export type MenuListPag = z.infer<typeof MenuListPagSchema>

export type MenuListResType = z.TypeOf<typeof MenuListRes>
export type CreateMenuBodyType = z.TypeOf<typeof CreateMenuBody>
export type CreateMenuReqType = z.TypeOf<typeof CreateMenuReq>

export type UpdateMenuBodyType = z.TypeOf<typeof UpdateMenuBody>
export type UpdateMenuReqType = z.TypeOf<typeof UpdateMenuReq>

export type MenuResType = z.TypeOf<typeof MenuRes>
export type MenuParamsType = z.TypeOf<typeof MenuParams>
