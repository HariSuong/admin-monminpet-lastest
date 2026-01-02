export async function POST(request: Request) {
  try {
    const res = await request.json()
    const sessionToken = res.sessionToken as string

    if (!sessionToken) {
      return Response.json(
        { message: 'Không nhận được session token' },
        { status: 400 }
      )
    }

    // Thiết lập cookie
    const headers = new Headers()
    headers.append(
      'Set-Cookie',
      `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      } Max-Age=${60 * 60 * 24 * 30}` // 30 ngày
    )

    return Response.json(
      { message: 'Lưu session token thành công' },
      { status: 200, headers }
    )
  } catch {
    return Response.json({ message: 'Lỗi server' }, { status: 500 })
  }
}
