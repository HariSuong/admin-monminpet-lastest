import z from 'zod'

// Schema cho body

export const CreatePostBody = z.object({
  thumb: z.string(),
  title: z.string().min(1).max(256),
  desc: z.string().min(1).max(1000),
  content: z.string().min(1),
  keywords: z.string().min(1),
  show: z.boolean(),
  hot: z.boolean(),
  priority: z.number().int(),
  menus: z.array(z.number())
})
export const CreatePostReq = z.object({
  thumb: z.string(),
  title: z.string().min(1).max(256),
  desc: z.string().min(1).max(1000),
  content: z.string().min(1),
  keywords: z.string().min(1),
  show: z.boolean(),
  hot: z.boolean(),
  priority: z.number().int(),
  menus: z.string()
})

// Schema cho update body
export const UpdatePostBody = CreatePostBody.extend({})
// Schema cho update req
export const UpdatePostReq = z.object({
  thumb: z.string().optional(),
  title: z.string().min(1).max(256).optional(),
  desc: z.string().min(1).max(1000).optional(),
  content: z.string().min(1).optional(),
  keywords: z.string().min(1).optional(),
  show: z.boolean().optional(),
  hot: z.boolean().optional(),
  priority: z.number().int().optional(),
  menus: z.string().optional()
})

export const PostSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const PostRes = z.object({
  data: PostSchema,
  message: z.string()
})

export const PostListRes = z.object({
  data: z.array(PostSchema),
  message: z.string()
})

export const PostParams = z.object({
  id: z.coerce.number()
})

// Type danh sách bài viết phân trang
export const PostItemSchema = z.object({
  id: z.number(),
  user: z.string().nullable(),
  thumb: z.string().url(),
  title: z.string(),
  desc: z.string(),
  content: z.string(),
  keywords: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  show: z.number(),
  hot: z.number(),
  priority: z.number(),
  count_view: z.number(),
  translate: z.string().nullable(),
  video: z.string().nullable(),
  menus: z.string()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const PostListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(PostItemSchema),
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

export type PostItem = z.infer<typeof PostItemSchema>
export type PostListPag = z.infer<typeof PostListPagSchema>

export type PostListResType = z.TypeOf<typeof PostListRes>
export type CreatePostBodyType = z.TypeOf<typeof CreatePostBody>
export type CreatePostReqType = z.TypeOf<typeof CreatePostReq>

export type UpdatePostBodyType = z.TypeOf<typeof UpdatePostBody>
export type UpdatePostReqType = z.TypeOf<typeof UpdatePostReq>

export type PostResType = z.TypeOf<typeof PostRes>
export type PostParamsType = z.TypeOf<typeof PostParams>
