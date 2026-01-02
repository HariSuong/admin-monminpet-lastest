// components/faqs/toggle-cell.tsx
'use client'

import { Switch } from '@mui/material'
import { useState } from 'react'
import { useToast } from '@/contexts/toast-context'

import { FaqItem } from '@/schemaValidations/faq.schema'
import faqApiRequest from '@/services/apiFaq'

interface ToggleCellProps {
  faq: FaqItem
  field: 'show'

  onSuccess?: () => void
}

export default function ToggleCell({ faq, field, onSuccess }: ToggleCellProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Chuyển đổi giá trị từ number sang boolean
  const currentValue = faq[field] === 1

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true)
      console.log('faq', faq)
      // Tạo body update với tất cả trường nhưng chỉ thay đổi trường cần toggle
      const updateBody = {
        answer: faq.answer,
        question: faq.question,
        sort: faq.sort,

        // Chuyển đổi các trường cần thiết
        show: checked ? 1 : 0
      }
      console.log('updateBody', updateBody)
      await faqApiRequest.updateFaqs(faq.id, updateBody)

      showToast({
        severity: 'success',
        message: 'Cập nhật thành công'
      })

      onSuccess?.()
    } catch (error) {
      console.log('error', error)
      showToast({
        severity: 'error',
        message: 'Cập nhật thất bại'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Switch
      checked={currentValue}
      onChange={e => handleChange(e.target.checked)}
      disabled={loading}
    />
  )
}
