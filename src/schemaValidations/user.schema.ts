import z from 'zod'
/**
 {
  "full_name": "Nguyen Van A",
  "birthday": "1995-08-15",
  "gender": "1", // 1 nam, 2 nữ, 0 khác
  "phone": "0909123456",
  "email": "nguyenvana@example.com",
  "address": "123 Đường Lê Lợi, Phường Bến Thành",
  "province": "TP.HCM",
  "created_at": "2025-05-02 10:30:00"
}

 */

// Schema cho body
export const CreateUserBody = z.object({
  full_name: z.string().nullable(),
  birthday: z.coerce.date().optional(),
  gender: z.coerce.number().int(),
  phone: z.string().nullable(),
  email: z.string().email(),
  address: z.string().nullable(),
  province: z.string().nullable(),
  created_at: z.coerce.date().optional()
})

// Schema cho body

export const CreateUserReq = z.object({
  full_name: z.string().nullable(),
  birthday: z.string().nullable(),
  gender: z.coerce.number().int(),
  phone: z.string().nullable(),
  email: z.string().email(),
  address: z.string().nullable(),
  province: z.string().nullable(),
  created_at: z.string().nullable()
})

// Schema cho update (kế thừa từ create và thêm id)
export const UpdateUserBody = CreateUserBody.extend({
  updated_at: z.string().optional()
})

export const UserParams = z.object({
  id: z.coerce.number()
})

// Type danh sách sản phẩm phân trang
export const UserItemSchema = z.object({
  id: z.coerce.number().int(),
  name: z.string().nullable(),
  full_name: z.string().nullable(),
  birthday: z.coerce.date().nullable(),
  gender: z.coerce.number().int(),
  phone: z.string().nullable(),
  email: z.string().email(),
  address: z.string().nullable(),
  province: z.string().nullable(),
  created_at: z.coerce.date()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const UserListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(UserItemSchema),
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

export type UserItem = z.infer<typeof UserItemSchema>
export type UserListPag = z.infer<typeof UserListPagSchema>

export type CreateUserBodyType = z.TypeOf<typeof CreateUserBody>
export type CreateUserReqType = z.TypeOf<typeof CreateUserReq>
export type UpdateUserBodyType = z.TypeOf<typeof UpdateUserBody>

export type UserParamsType = z.TypeOf<typeof UserParams>
