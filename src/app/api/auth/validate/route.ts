import http from '@/libs/http'
import { NextResponse } from 'next/server'

interface ValidateResponse {
  valid: boolean
}
export async function GET() {
  try {
    // Gọi đến backend để validate token
    const response = await http.get<ValidateResponse>('/auth/validate', {
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL
    })

    return NextResponse.json({ valid: response.payload.valid })
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}
