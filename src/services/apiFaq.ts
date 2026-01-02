// src/services/apiFaqs.js

import http from '@/libs/http'
import {
  CreateFaqReqType,
  FaqListPag,
  UpdateFaqReqType
} from '@/schemaValidations/faq.schema'

const faqApiRequest = {
  getFaqs: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number = 0
  ) =>
    http.get<FaqListPag>(
      `/faqs?perPage=${per_page}&page=${page}${id ? `&id=${id}` : ''}`,
      {
        ...(sessionToken && {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }),
        cache: 'no-store'
      }
    ),

  insertFaqs: (body: CreateFaqReqType) =>
    http.post<CreateFaqReqType>(`/faqs/insert`, body),
  updateFaqs: (id: number, body: UpdateFaqReqType) =>
    http.post<UpdateFaqReqType>(`/faqs/update/${id}`, body),
  deleteFaqs: (id: number) =>
    http.delete<{ message: string }>(`/faqs/delete/${id}`, {})
}

export default faqApiRequest
