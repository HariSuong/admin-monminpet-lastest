// src/lib/http.ts

import envConfig from '@/config'
import { LoginResType } from '@/schemaValidations/auth.schema'
import authApiRequest from '@/services/apiAuth'

type CustomOptions = Omit<RequestInit, 'method' | 'body'> & {
  baseUrl?: string | undefined
  body?: unknown
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: unknown
  }
  constructor({
    status,
    payload
  }: {
    status: number
    payload: { message: string; [key: string]: unknown }
  }) {
    super(payload.message || `HTTP Error: ${status}`)
    this.status = status
    this.payload = payload
  }
}

class SessionTokenClient {
  private token = ''

  get value() {
    return this.token
  }

  set value(token: string) {
    if (typeof window === 'undefined') {
      throw new Error('Không thể thiết lập token trên server side')
    }
    this.token = token
  }
}

export const sessionTokenClient = new SessionTokenClient()

const request = async <Response>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options?: CustomOptions | undefined,
  timeout = 120000
) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  // console.log('timeoutId',timeoutId)

  const isFormData = (body: unknown): body is FormData =>
    typeof FormData !== 'undefined' && body instanceof FormData

  // Xử lý body
  const body = options?.body
    ? isFormData(options.body)
      ? options.body
      : JSON.stringify(options.body)
    : undefined

  // Base headers
  const baseHeaders = {
    'Content-Type': 'application/json',
    Authorization: sessionTokenClient.value
      ? `Bearer ${sessionTokenClient.value}`
      : ''
  }

  // console.log('baseHeaders', baseHeaders)

  // Xử lý headers
  const headers = isFormData(options?.body)
    ? {
        // Chỉ giữ lại Authorization từ baseHeaders
        Authorization: baseHeaders.Authorization,
        // Merge với headers từ options (không có Content-Type)
        ...options?.headers
      }
    : {
        ...baseHeaders,
        ...options?.headers,
        'Content-Type': 'application/json' // Đảm bảo Content-Type cho non-FormData
      }

  // console.log('headers', headers)
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_BACKEND_URL
      : options.baseUrl

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`
  // console.log('fullUrl', fullUrl)
  try {
    const response = await fetch(fullUrl, {
      ...options,
      method,
      headers, // Sử dụng headers đã xử lý
      body,
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    // Kiểm tra nếu bị 401 Unauthorized
    if (response.status === 401) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(
        typeof window !== 'undefined' ? window.location.pathname : '/'
      )}`

      if (typeof window !== 'undefined') {
        await authApiRequest.logoutFrClientToNextServer()
        sessionTokenClient.value = ''
        window.location.href = redirectUrl

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {} as any
      } else {
        throw new HttpError({
          status: 401,
          payload: { message: 'Phiên đăng nhập đã hết hạn', redirectUrl }
        })
      }
    }

    // Kiểm tra Content-Type
    const contentType = response.headers.get('Content-Type')
    // console.log('contentType', contentType?.includes('application/json'))

    let payload: Response

    if (contentType?.includes('application/json')) {
      payload = await response.json()
    } else {
      payload = (await response.text()) as Response
    }

    // const payload: Response = await response.json()
    const data = {
      status: response.status,
      payload
    }

    if (!response.ok) {
      throw new HttpError({
        status: response.status,
        payload: {
          message:
            (payload as { message?: string })?.message || 'An error occurred',
          ...((typeof payload === 'object' && payload) || {})
        }
      })
    }

    if (typeof window !== 'undefined') {
      if (['/login'].includes(url)) {
        sessionTokenClient.value = (payload as LoginResType).token
      } else if (['/logout'].includes(url)) {
        sessionTokenClient.value = ''
      }
    }

    return data
  } catch (error: unknown) {
    clearTimeout(timeoutId) // Đảm bảo clear timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

const http = {
  get: <Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) => request<Response>(url, 'GET', options),
  post: <Response>(
    url: string,
    body: unknown,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) => request<Response>(url, 'POST', { ...options, body }),
  put: <Response>(
    url: string,
    body: unknown,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) => request<Response>(url, 'PUT', { ...options, body }),
  delete: <Response>(
    url: string,
    body: unknown,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) => request<Response>(url, 'DELETE', { ...options, body })
}

export default http
