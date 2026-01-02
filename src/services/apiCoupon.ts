// src/services/apiCoupons.js

import http from '@/libs/http'
import {
  CouponListPag,
  CreateCouponReqType,
  UpdateCouponReqType
} from '@/schemaValidations/coupon.schema'

const couponApiRequest = {
  getCoupons: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number = 0
  ) =>
    http.get<CouponListPag>(
      `/coupons?perPage=${per_page}&page=${page}${id ? `&id=${id}` : ''}`,
      {
        ...(sessionToken && {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }),
        cache: 'no-store'
      }
    ),

  insertCoupons: (body: CreateCouponReqType) =>
    http.post<CreateCouponReqType>(`/coupons/insert`, body),

  updateCoupons: (id: number, body: UpdateCouponReqType) =>
    http.post<UpdateCouponReqType>(`/coupons/update/${id}`, body),

  deleteCoupons: (id: number) =>
    http.delete<{ message: string }>(`/coupons/delete/${id}`, {})
}

export default couponApiRequest
