import { z } from 'zod'

export const InvoiceDashboardItemSchema = z.object({
  id: z.number(),
  price: z.number(),
  user: z.number(),
  name: z.string(),
  email: z.string(),
  country: z.string(),
  calling_code: z.string(),
  phone: z.string(),
  address: z.string(),
  delivered_at: z.string().nullable(),
  received_at: z.string(),
  paid: z.number(),
  delivered: z.number(),
  message: z.string().nullable(),
  note: z.string().nullable(),
  province: z.string().nullable(),
  district: z.string().nullable(),
  ward: z.string().nullable(),
  total_sales: z.any().nullable(),
  invoice_old: z.any().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  point: z.number(),
  fee: z.number(),
  discount: z.number(),
  amount: z.number(),
  method: z.number(),
  json_invoices: z.string(), // string JSON chứ không phải object!
  code_payment: z.string(),
  code: z.string().nullable(),
  total: z.string()
})

export const DashboardDataSchema = z.object({
  total_invoices: z.number(),
  total_products: z.number(),
  total_posts: z.number(),
  latest_invoices: z.array(InvoiceDashboardItemSchema)
})

export const DashboardResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: DashboardDataSchema
})

export type DashboardResponseType = z.infer<typeof DashboardResponseSchema>
export type InvoiceDashboardItemType = z.infer<
  typeof InvoiceDashboardItemSchema
>
