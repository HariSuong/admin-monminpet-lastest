import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const privatePaths = [
  '/',
  '/attributes',
  '/coupons',
  '/faqs',
  '/invoices',
  '/posts',
  '/products',
  '/reviews',
  '/services',
  '/menus'
]
const authPaths = ['/login', '/register', '/password-reset']

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('sessionToken')

  const isPrivate = privatePaths.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  )

  const isAuth = authPaths.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  )

  // Thêm logic validate token với backend
  if (isPrivate && sessionToken) {
    try {
      // Gọi API backend validate token đúng url từ biến môi trường
      const validateUrl = `https://cdn.monminpet.com/public/api/auth/validate`
      // console.log('validateUrl', validateUrl)
      const validateResponse = await fetch(validateUrl, {
        headers: {
          Authorization: `Bearer ${sessionToken.value}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      // Check HTTP status
      if (!validateResponse.ok) {
        throw new Error(`HTTP error! status: ${validateResponse.status}`)
      }

      // Check response body
      const data = await validateResponse.json()

      // console.log('validateResponse data', data)
      if (!data.valid) {
        throw new Error('Invalid token in response')
      }
    } catch {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(redirectUrl)
      response.cookies.delete('sessionToken')
      return response
    }
  }

  // Nếu là trang riêng tư mà chưa có token => chuyển hướng đến login + redirect về trang cũ
  if (isPrivate && !sessionToken) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Nếu là trang login/register mà đã có token => chuyển về trang chủ
  if (isAuth && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: [...privatePath, ...authPath]
  matcher: [
    '/',
    '/attributes',
    '/coupons',
    '/faqs',
    '/invoices',
    '/posts',
    '/products',
    '/reviews',
    '/services',
    '/menus',
    '/login',
    '/password-reset'
  ]
}
