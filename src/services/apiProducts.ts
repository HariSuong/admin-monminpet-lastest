// src/services/apiProducts.js

import http from '@/libs/http'
import {
  CreateProductReqType,
  ProductListPag,
  UpdateProductReqType
} from '@/schemaValidations/product.schema'

const productApiRequest = {
  getProducts: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number | null = null
  ) =>
    http.get<ProductListPag>(
      `/products?page=${page}&perPage=${per_page}${id ? `&id=${id}` : ''}
      `,
      {
        ...(sessionToken && {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }),
        cache: 'no-store'
      }
    ),

  insertProduct: (body: CreateProductReqType) =>
    http.post<CreateProductReqType>(`/products/insert`, body),
  uploadTempImage: (formData: FormData) =>
    http.post<string>(`/products/upload-temp-image`, formData),

  updateProduct: (id: number, body: UpdateProductReqType) =>
    http.post<UpdateProductReqType>(`/products/update/${id}`, body),
  deleteProduct: (id: number) =>
    http.delete<{ message: string }>(`/products/delete/${id}`, {})
}

export default productApiRequest
