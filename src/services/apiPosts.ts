// src/services/apiPosts.js

import http from '@/libs/http'
import {
  CreatePostReqType,
  PostListPag,
  UpdatePostReqType
} from '@/schemaValidations/post.schema'

const postApiRequest = {
  getPosts: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number | null = null
  ) =>
    http.get<PostListPag>(
      `/posts?page=${page}&perPage=${per_page}${id ? `&id=${id}` : ''}
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

  getPost: (id: number) => http.get<PostListPag>(`/posts?id=${id}`),

  insertPost: (body: CreatePostReqType) =>
    http.post<CreatePostReqType>(`/posts/insert`, body),
  uploadTempImage: (formData: FormData) =>
    http.post<string>(`/posts/upload-temp-image`, formData),
  updatePost: (id: number, body: UpdatePostReqType) =>
    http.post<UpdatePostReqType>(`/posts/update/${id}`, body),
  deletePost: (id: number) =>
    http.delete<{ message: string }>(`/posts/delete/${id}`, {})
}

export default postApiRequest
