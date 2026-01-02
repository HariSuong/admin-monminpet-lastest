import { z } from 'zod'

export const ServiceItemSchema = z.object({
  id: z.number(),
  user: z.number().nullable(),
  thumb: z.string().nullable(),
  title: z.string().nullable(),
  desc: z.string().nullable(),
  content: z.string().nullable(),
  tags: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  show: z.number().nullable(),
  hot: z.number().nullable(),
  priority: z.number().nullable(),
  count_view: z.number(),
  translate: z.string().nullable(),
  video: z.string().nullable(),
  menus: z.string().nullable(),
  type_thumb_video: z.string().nullable(),
  faqs: z.string().nullable()
})

export const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const ServiceResponseSchema = z.object({
  current_page: z.number(),
  data: z.array(ServiceItemSchema),
  first_page_url: z.string().url(),
  from: z.number().nullable(),
  last_page: z.number(),
  last_page_url: z.string().url(),
  links: z.array(PaginationLinkSchema),
  next_page_url: z.string().nullable(),
  path: z.string().url(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  to: z.number().nullable(),
  total: z.number()
})

// ✅ Tạo TypeScript type từ schema
export type ServiceResponseType = z.infer<typeof ServiceResponseSchema>

export const InsertServiceBody = z.object({
  title: z.string().nullable(),
  content: z.string().nullable(),
  desc: z.string().nullable(),
  show: z.number().nullable(),
  hot: z.number().nullable(),
  priority: z.number().nullable(),
  video: z.string().nullable(),
  menus: z.string().nullable(),
  type_thumb_video: z.string().nullable(),
  faqs: z.string().nullable(),
  tags: z.string().nullable(),
  thumb: z.string().nullable(),
  updated_at: z.string().datetime(),
  created_at: z.string().datetime(),
  user: z.number(),
  id: z.number()
})

// ✅ Tạo TypeScript type từ schema
export type InsertServiceBodyType = z.infer<typeof InsertServiceBody>
