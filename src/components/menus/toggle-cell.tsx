// components/menus/toggle-cell.tsx
'use client'

import { Switch } from '@mui/material'
import { useState } from 'react'
import { useToast } from '@/contexts/toast-context'
import { MenuItem } from '@/schemaValidations/menus.schema'
import menuApiRequest from '@/services/apiMenu'

interface ToggleCellProps {
  menu: MenuItem
  field: 'hot' | 'show'

  onSuccess?: () => void
}

export default function ToggleCell({
  menu,
  field,
  onSuccess
}: ToggleCellProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Chuyển đổi giá trị từ number sang boolean
  const currentValue = Number(menu[field]) === 1

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true)
      console.log('menu', menu)
      // Tạo body update với tất cả trường nhưng chỉ thay đổi trường cần toggle
      const updateBody = {
        name: menu.name,
        thumb: menu.thumb,
        desc: menu.desc,
        inside: menu.inside,
        display_type: Number(menu.display_type),
        order: menu.order,

        // Chuyển đổi các trường cần thiết
        show: Number(menu.show) === 1 ? true : false,
        hot: Number(menu.hot) === 1 ? true : false,
        [field]: checked ? true : false
      }
      console.log('updateBody', updateBody)
      await menuApiRequest.updateMenu(menu.id, updateBody)

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
