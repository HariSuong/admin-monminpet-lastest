import z from 'zod'

// Schema cho body

export const CreateAttributeBody = z.object({
  attribute_id: z.coerce.number(),
  name: z.string().min(1).max(256),
  product_id: z.coerce.number(),
  price: z.string(),
  image: z.string().nullable()
})

export const CreateAttributeReq = z.object({
  attribute_id: z.coerce.number(),
  name: z.string().min(1).max(256),
  product_id: z.coerce.number(),
  price: z.number(),
  image: z.string().nullable()
})

// Schema cho update (kế thừa từ create và thêm id)
export const UpdateAttributeBody = CreateAttributeBody.extend({})

export const AttributeSchema = z.object({
  id: z.number(),
  name: z.string(),
  show: z.number()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const AttributePagSchema = z.object({
  current_page: z.number(),
  data: z.array(AttributeSchema),
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

export const AttributeRes = z.object({
  data: AttributeSchema,
  message: z.string()
})

export const AttributeListRes = z.object({
  data: z.array(AttributeSchema),
  message: z.string()
})

export const AttributeParams = z.object({
  id: z.coerce.number()
})

// Type danh sách sản phẩm phân trang
export const AttributeItemSchema = z.object({
  id: z.number(),
  attribute_id: z.number(),
  attribute_name: z.string(),
  product_name: z.string(),
  product_id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string().nullable()
})

export const AttributeListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(AttributeItemSchema),
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

export type AttributeItem = z.infer<typeof AttributeItemSchema>
export type AttributeListPag = z.infer<typeof AttributeListPagSchema>

export type AttributePagType = z.infer<typeof AttributePagSchema>

export type AttributeListResType = z.TypeOf<typeof AttributeListRes>
export type CreateAttributeBodyType = z.TypeOf<typeof CreateAttributeBody>
export type CreateAttributeReqType = z.TypeOf<typeof CreateAttributeReq>

export type UpdateAttributeBodyType = z.TypeOf<typeof UpdateAttributeBody>
export type AttributeResType = z.TypeOf<typeof AttributeRes>
export type AttributeParamsType = z.TypeOf<typeof AttributeParams>
