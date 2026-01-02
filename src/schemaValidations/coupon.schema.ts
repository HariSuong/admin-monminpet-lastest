import z from 'zod'
/**
 {
    "code": "MONMIN60",
    "discount": 60000,
    "type": 0,
    "exp_time": "2025-07-31",
    "active": true,
    "count": 20,
    "reached_price": 998000,
    "users":""
}

 */

// Schema cho body
export const CreateCouponBody = z.object({
  code: z.string().min(1).max(256),
  discount: z.string(),
  type: z.coerce.number().int(),
  exp_time: z.coerce.date(),
  active: z.boolean(),
  count: z.string(),
  reached_price: z.string(),
  users: z.array(z.number()).optional()
})

// Schema cho insert

export const CreateCouponReq = z.object({
  code: z.string().min(1).max(256),
  discount: z.number().int(),
  type: z.coerce.number().int(),
  exp_time: z.string(),
  active: z.boolean(),
  count: z.number().int(),
  reached_price: z.number().int(),
  users: z.array(z.number()).optional()
})

// Schema cho update (kế thừa từ create và thêm id)
export const UpdateCouponBody = CreateCouponBody.extend({})
export const UpdateCouponReq = CreateCouponReq.extend({
  users: z.array(z.number())
})

export const CouponParams = z.object({
  id: z.coerce.number()
})

// Type danh sách sản phẩm phân trang

export const CouponItemSchema = z.object({
  id: z.coerce.number().int(),
  code: z.string().nullable(),
  discount: z.number(),
  type: z.number(),
  exp_time: z.coerce.date(),
  active: z.number(),
  count: z.number(),
  reached_price: z.number(),
  users: z.string(),
  created_at: z.coerce.date(),
  user_list: z
    .array(
      z.object({
        id: z.coerce.number().int(),
        full_name: z.string()
      })
    )
    .optional()
})

// Pagination schema
const PaginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean()
})

export const CouponListPagSchema = z.object({
  current_page: z.number(),
  data: z.array(CouponItemSchema),
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

export type CouponItem = z.infer<typeof CouponItemSchema>
export type CouponListPag = z.infer<typeof CouponListPagSchema>

export type CreateCouponBodyType = z.TypeOf<typeof CreateCouponBody>
export type CreateCouponReqType = z.TypeOf<typeof CreateCouponReq>
export type UpdateCouponBodyType = z.TypeOf<typeof UpdateCouponBody>
export type UpdateCouponReqType = z.TypeOf<typeof UpdateCouponReq>

export type CouponParamsType = z.TypeOf<typeof CouponParams>
