// src/services/apiAttributes.js

import http from '@/libs/http'
import { CreateUserReqType, UserListPag } from '@/schemaValidations/user.schema'

const userApiRequest = {
  getUsers: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number = 0
  ) =>
    http.get<UserListPag>(
      `/users?perPage=${per_page}&page=${page}${id ? `&id=${id}` : ''}`,
      {
        ...(sessionToken && {
          headers: {
            Authorization: `Bearer ${sessionToken}`
          }
        }),
        next: { revalidate: 60 }
      }
    ),

  insertUsers: (body: CreateUserReqType) =>
    http.post<CreateUserReqType>(`/users/insert`, body)
  // uploadTempImage: (formData: FormData) =>
  //   http.post<string>(`/product-users/upload-temp-image`, formData),

  // updateAttributes: (
  //   id: number,
  //   body: UpdateProductBodyType,
  //   sessionToken: string
  // ) =>
  //   http.post<UpdateProductBodyType>(`/product-users/update/${id}`, body, {
  //     headers: {
  //       Authorization: `Bearer ${sessionToken}`
  //     }
  //   })
}

export default userApiRequest
