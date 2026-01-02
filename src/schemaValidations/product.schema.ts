// src/schemaValidations/product.schema.ts


import z from 'zod'

// Schema cho body
export const CreateProductBody = z.object({
  thumb: z.string().url(),
  name: z.string().min(1).max(256),
  desc: z.string().min(1).max(1000),
  tags: z.string().min(1),
  code: z.string().nullable().optional(),
  classify: z.string().nullable().optional(),
  content: z.string().min(1),
  imgs: z.string(),
  price: z.string().min(1),
  price_old: z.string().optional(),
  menus: z.array(z.number()),
  point_change: z.string().optional(),
  show: z.boolean(),
  hot: z.boolean(),
  gift: z.boolean(),
  priority: z.number().int(),
  bestseller: z.string().optional(),
  countdown_timer: z.coerce.date().optional(),
  faqs: z.array(z.number()).optional(),
  suggests: z.array(z.number()).optional()
})

// Schema cho req

export const CreateProductReq = z.object({
  thumb: z.string().url().optional(),
  name: z.string().min(1).max(256),
  desc: z.string().min(1).max(1000),
  tags: z.string().min(1),
  code: z.string().nullable().optional(),
  classify: z.string().nullable().optional(),
  content: z.string().min(1),
  imgs: z.string().optional(),
  price: z.number(),
  price_old: z.number(),
  menus: z.string(),
  point_change: z.number(),
  show: z.boolean(),
  hot: z.boolean(),
  gift: z.boolean(),
  priority: z.number().int(),
  bestseller: z.number().optional(),
  countdown_timer: z.string().optional(),
  faqs: z.array(z.number()).nullable().optional(),
  suggests: z.array(z.number()).optional()
})

// Schema cho update (kế thừa từ create và thêm id)
export const UpdateProductBody = CreateProductBody.extend({})
// Schema cho update req (kế thừa từ create req và thêm id)
export const UpdateProductReq = CreateProductReq.extend({})

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const ProductRes = z.object({
  data: ProductSchema,
  message: z.string()
})

export const ProductListRes = z.object({
  data: z.array(ProductSchema),
  message: z.string()
})

export const ProductParams = z.object({
  id: z.coerce.number()
})

// Type danh sách sản phẩm phân trang
export const ProductItemSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  thumb: z.string().url(),
  imgs: z.array(z.string().url()),
  name: z.string(),
  desc: z.string(),
  classify: z.any().nullable(), // nếu cần rõ hơn có thể điều chỉnh
  content: z.string(),
  tags: z.string(),
  price: z.number(),
  point_change: z.number(),
  menus: z.string(), // nếu là mảng số thì sửa thành z.array(z.number())
  show: z.number(),
  hot: z.number(),
  gift: z.number(),
  stock: z.any().nullable(), // hoặc dùng z.number().nullable() nếu biết chắc kiểu
  priority: z.number(),
  count_view: z.any().nullable(),
  price_old: z.number(),
  translate: z.any().nullable(),
  video: z.string().nullable(),
  type_thumb_video: z.string(),
  faqs: z
    .string()
    .regex(/^(\d+,)*\d+$/)
    .nullable(),
  suggests: z.string(), // ví dụ "2,3"
  attributes: z.any().nullable(),
  countdown_timer: z.number().nullable(),
  stock_import: z.number(),
  updated_at: z.string(), // hoặc z.coerce.date() nếu bạn parse thành Date
  created_at: z.string(), // như trên
  bestseller: z.number()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const ProductListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(ProductItemSchema),
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

export type ProductItem = z.infer<typeof ProductItemSchema>
export type ProductListPag = z.infer<typeof ProductListPagSchema>

export type ProductListResType = z.TypeOf<typeof ProductListRes>
export type CreateProductBodyType = z.TypeOf<typeof CreateProductBody>
export type CreateProductReqType = z.TypeOf<typeof CreateProductReq>
export type UpdateProductBodyType = z.TypeOf<typeof UpdateProductBody>
export type UpdateProductReqType = z.TypeOf<typeof UpdateProductReq>
export type ProductResType = z.TypeOf<typeof ProductRes>
export type ProductParamsType = z.TypeOf<typeof ProductParams>
