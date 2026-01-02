// src/services/apiAttributes.js

import http from '@/libs/http'
import {
  AttributeListPag,
  AttributePagType,
  CreateAttributeReqType,
  UpdateAttributeBodyType
} from '@/schemaValidations/attribute.schema'

const attributeApiRequest = {
  getAttributes: (sessionToken: string = '') =>
    http.get<AttributePagType>(`/attributes`, {
      ...(sessionToken && {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      }),
      cache: 'no-store'
    }),

  getProductAttributes: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number = 0
  ) =>
    http.get<AttributeListPag>(
      `/product-attributes?perPage=${per_page}&page=${page}${
        id ? `&id=${id}` : ''
      }`,
      {
        ...(sessionToken && {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }),
        cache: 'no-store'
      }
    ),

  insertAttributes: (body: CreateAttributeReqType) =>
    http.post<CreateAttributeReqType>(`/product-attributes/insert`, body),
  uploadTempImage: (formData: FormData) =>
    http.post<string>(`/product-attributes/upload-temp-image`, formData),

  updateAttributes: (id: number, body: UpdateAttributeBodyType) =>
    http.post<UpdateAttributeBodyType>(
      `/product-attributes/update/${id}`,
      body
    ),
  deleteAttributes: (id: number) =>
    http.delete<{ message: string }>(`/product-attributes/delete/${id}`, {})
}

export default attributeApiRequest
