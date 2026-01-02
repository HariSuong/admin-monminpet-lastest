// components/services/toggle-cell.tsx
'use client'

import { Switch } from '@mui/material'
import { useState } from 'react'
import { useToast } from '@/contexts/toast-context'
import { ServiceItem } from '@/schemaValidations/services.schema'
import serviceApiRequest from '@/services/apiMenu'

interface ToggleCellProps {
  service: ServiceItem
  field: 'hot' | 'show'

  onSuccess?: () => void
}

export default function ToggleCell({
  service,
  field,
  onSuccess
}: ToggleCellProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Chuyển đổi giá trị từ number sang boolean
  const currentValue = Number(service[field]) === 1

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true)
      console.log('service', service)
      // Tạo body update với tất cả trường nhưng chỉ thay đổi trường cần toggle
      const updateBody = {
        name: service.name,
        thumb: service.thumb,
        content: service.content,
        desc: service.desc,
        inside: service.inside,
        display_type: Number(service.display_type),
        order: service.order,
        faq: service.faqs
          ? service.faqs
              .split(',')
              .map(item => (isNaN(Number(item)) ? undefined : Number(item)))
              .filter(item => item !== undefined)
          : [],
        // Chuyển đổi các trường cần thiết
        show: Number(service.show) === 1 ? true : false,
        hot: Number(service.hot) === 1 ? true : false,
        [field]: checked ? true : false
      }
      console.log('updateBody', updateBody)
      await serviceApiRequest.updateMenu(service.id, updateBody)

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
