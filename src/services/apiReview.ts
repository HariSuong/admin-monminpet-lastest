// src/services/apiReviews.js

import http from '@/libs/http'
import {
  ReviewListPag,
  UpdateReviewBodyType
} from '@/schemaValidations/review.schema'

const reviewApiRequest = {
  getReviews: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number | null = null
  ) =>
    http.get<ReviewListPag>(
      `/reviews?page=${page}&perPage=${per_page}${id ? `&id=${id}` : ''}`,
      {
        ...(sessionToken && {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }),
        cache: 'no-store'
      }
    ),

  // insertReviews: (body: CreateReviewReqType) =>
  //   http.post<CreateReviewReqType>(`/reviews/insert`, body),

  updateReviews: (id: number, body: UpdateReviewBodyType) =>
    http.post<UpdateReviewBodyType>(`/reviews/update/${id}`, body),
  deleteReviews: (id: number) =>
    http.delete<{ message: string }>(`/reviews/delete/${id}`, {})
}

export default reviewApiRequest
