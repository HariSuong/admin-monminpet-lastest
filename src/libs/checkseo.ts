// src/lib/checkseo.ts

import { convert } from 'html-to-text'
import { decode } from 'html-entities'

export function checkSEO({
  title,
  desc,
  keywords,
  content
}: {
  title: string
  desc: string
  keywords: string
  content: string
}): string[] {
  const results: string[] = []
  const warnings: string[] = []

  // HTML -> text + decode entities
  const rawText = convert(content || '', {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: false } },
      { selector: 'img', format: 'skip' }
    ]
  })
  const text = decode(rawText)
  const contentLower = text.toLowerCase()

  // Tách từ khóa thành từ đơn
  const keywordList = keywords
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(Boolean)

  const keywordParts: string[] = []
  keywordList.forEach(k => {
    keywordParts.push(...k.split(' ').filter(Boolean))
  })

  // ✅ Check 1: Nội dung có chứa từ khóa thành phần
  const matchedInContent = keywordParts.find(k => contentLower.includes(k))
  if (matchedInContent) {
    results.push(`✅ Nội dung đã chứa từ khóa "${matchedInContent}".`)
  } else {
    warnings.push(`❌ Nội dung chưa chứa từ khóa nào.`)
  }

  // ✅ Check 2: Từ khóa trong tiêu đề/mô tả
  const metaText = `${title} ${desc}`.toLowerCase()
  const matchedInMeta = keywordParts.find(k => metaText.includes(k))
  if (matchedInMeta) {
    results.push(
      `✅ Đã thấy từ khóa "${matchedInMeta}" trong tiêu đề hoặc mô tả.`
    )
  } else {
    warnings.push(`⚠️ Không thấy từ khóa nào trong tiêu đề hoặc mô tả.`)
  }

  // ✅ Check 3: Link nội bộ
  const internalLinkRegex =
    /<a [^>]*href=["']https?:\/\/(www\.)?monminpet\.com\//gi
  const internalLinks = content.match(internalLinkRegex) || []
  if (internalLinks.length > 0) {
    results.push(`✅ Có ${internalLinks.length} link nội bộ.`)
  } else {
    warnings.push(
      '⚠️ Bài viết chưa có link nội bộ đến trang của bạn (monminpet.com).'
    )
  }

  // ✅ Check 4: Ngắt câu hợp lý
  const longLines = text
    .split('\n')
    .filter(line => line.length > 1000 && !line.includes('.'))

  if (longLines.length > 0) {
    warnings.push(
      `💡 Có ${longLines.length} đoạn dài không có dấu chấm. Gợi ý nên ngắt câu rõ ràng.`
    )
  } else {
    results.push(`✅ Câu văn đã được ngắt đoạn hợp lý.`)
  }

  // ✅ Nếu không có warning nào, chúc mừng luôn!
  if (warnings.length === 0) {
    return ['🎉 Bài viết đã đạt chuẩn SEO cơ bản.']
  }

  // Nếu có warning, đưa các kết quả đúng + warning
  return [...results, ...warnings]
}
