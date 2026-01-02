import { z } from 'zod'

// Type danh sách sản phẩm phân trang
export const MenuItemSchema = z.object({
  id: z.number(),
  icon: z.string().nullable(),
  thumb: z.string().url(),
  name: z.string(),
  desc: z.string().nullable(),
  content: z.string(),
  keywords: z.string().nullable(),
  display_type: z.number(),
  inside: z.number(),
  hot: z.number(),
  show: z.number(),
  order: z.number(),
  translate: z.string().nullable(),
  type_thumb_video: z.string(),
  video: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string(),
  faqs: z.string().nullable()
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

export type MenuItemType = z.infer<typeof MenuItemSchema>
export type MenuListPagType = z.infer<typeof MenuListPagSchema>
