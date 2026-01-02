//src/libs/formatData.ts

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

// Fortmat time
dayjs.extend(utc)
dayjs.extend(timezone)

export function formatToVNDateTime(dateInput: string | Date): string {
  return dayjs.utc(dateInput).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm')
}
export function formatToVNDate(dateInput: string | Date): string {
  return dayjs.utc(dateInput).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD')
}

// Format price
export function parsePriceString(priceStr: string): number {
  // Loại bỏ "đ", dấu chấm ngăn cách hàng nghìn, khoảng trắng
  const cleaned = priceStr.replace(/[^\d]/g, '')
  return Number(cleaned)
}
