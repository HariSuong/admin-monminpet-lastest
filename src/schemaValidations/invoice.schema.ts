import { z } from 'zod'

export const AttributeSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  attribute_id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string().nullable()
})

export const InvoiceProductSchema = z.object({
  id: z.number(),
  invoice_id: z.number(),
  product_id: z.number(),
  price: z.number(),
  quantity: z.number(),
  attributes: z.string(),
  note: z.string(),
  price_og: z.number(),
  content: z.string().nullable(),
  rating: z.number(),
  created_at: z.string(), // Hoặc dùng z.coerce.date() nếu muốn xử lý ngày
  updated_at: z.string(),
  product_name: z.string(),
  product_thumb: z.string().url()
})

export const InvoiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  phone: z.string(),
  message: z.string(),
  note: z.string(),
  paid: z.number(), // 0 hoặc 1
  delivered: z.number(), // 0 hoặc 1
  created_at: z.string(), // hoặc z.coerce.date()
  point: z.number(),
  discount: z.number(),
  amount: z.number(),
  total: z.string(),
  invoice_products: z.array(InvoiceProductSchema)
})

export const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const InvoiceListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(InvoiceSchema),
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

export const UpdateInvoiceBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  phone: z.string().min(1),
  message: z.string().optional(),
  note: z.string().optional(),
  paid: z.boolean(), // Chỉ chấp nhận 0 hoặc 1
  delivered: z.boolean() // Chỉ chấp nhận 0 hoặc 1
})

export const UpdateInvoiceReq = UpdateInvoiceBody.extend({
  paid: z.number(), // Chỉ chấp nhận 0 hoặc 1
  delivered: z.number() // Chỉ chấp nhận 0 hoặc 1
})

export const InvoiceResponseSchema = z.object({
  id: z.number(),
  price: z.number(),
  user: z.number(),
  name: z.string(),
  email: z.string().email(),
  country: z.string().nullable(), // Rỗng nên nullable
  calling_code: z.string().nullable(),
  phone: z.string(),
  address: z.string(),
  delivered_at: z.string().nullable(), // ISO string hoặc null
  received_at: z.string().nullable(),
  paid: z.number().int().min(0).max(1),
  delivered: z.number().int().min(0).max(1),
  message: z.string(),
  note: z.string(),
  province: z.any().nullable(), // Có thể là object trong tương lai? (hiện null)
  district: z.any().nullable(),
  ward: z.any().nullable(),
  total_sales: z.any().nullable(),
  invoice_old: z.any().nullable(),
  created_at: z.string(), // ISO 8601
  updated_at: z.string(),
  point: z.number(),
  fee: z.number(),
  discount: z.number(),
  amount: z.number(),
  method: z.number(),
  json_invoices: z.string(), // Là JSON string chứ không phải array
  code_payment: z.string(),
  code: z.string(),
  total: z.string()
})

// Types
export type InvoiceProduct = z.infer<typeof InvoiceProductSchema>
export type Invoice = z.infer<typeof InvoiceSchema>
export type InvoiceListPag = z.infer<typeof InvoiceListPagSchema>
export type UpdateInvoiceBodyType = z.infer<typeof UpdateInvoiceBody>
export type UpdateInvoiceResType = z.infer<typeof UpdateInvoiceReq>
export type Attribute = z.infer<typeof AttributeSchema>
