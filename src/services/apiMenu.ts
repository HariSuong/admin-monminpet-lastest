// src/services/apiMenu.js

import http from '@/libs/http'

import {
  CreateMenuReqType,
  MenuItem,
  MenuListPag,
  UpdateMenuReqType
} from '@/schemaValidations/menus.schema'

const menuApiRequest = {
  getMenus: (
    sessionToken: string,
    display_type: number = 1,
    per_page: number = 10
  ) =>
    http.get<MenuItem[]>(
      `/menus?display_type=${display_type}&perPage=${per_page}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        next: { revalidate: 60 }
      }
    ),
  getAllMenus: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number | null = null
  ) =>
    http.get<MenuListPag>(
      `/menus2?page=${page}&perPage=${per_page}${id ? `&id=${id}&edit=1` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        cache: 'no-store'
      }
    ),
  getAllServices: (
    sessionToken: string = '',
    page: number = 1,
    per_page: number = 20,
    id: number | null = null
  ) =>
    http.get<MenuListPag>(
      `/menus2?display_type=4&page=${page}&perPage=${per_page}${
        id ? `&id=${id}&edit=1` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        },
        cache: 'no-store'
      }
    ),
  getMenusClient: (display_type: number = 1, per_page: number = 10) =>
    http.get<MenuListPag>(
      `/menus?display_type=${display_type}&perPage=${per_page}`
    ),
  insertMenu: (body: CreateMenuReqType) =>
    http.post<CreateMenuReqType>(`/menus/insert`, body),
  updateMenu: (id: number, body: UpdateMenuReqType) =>
    http.post<UpdateMenuReqType>(`/menus/update/${id}`, body),
  deleteMenu: (id: number) =>
    http.delete<{ message: string }>(`/menus/delete/${id}`, {}),
  uploadTempImage: (formData: FormData) =>
    http.post<string>(`/menus/upload-temp-image`, formData)
}

export default menuApiRequest
