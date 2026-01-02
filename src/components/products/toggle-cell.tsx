// src/components/products/toggle-cell.tsx
'use client'

import { useToast } from '@/contexts/toast-context'
import { Switch } from '@mui/material'
import { useState } from 'react'

import { ProductItem } from '@/schemaValidations/product.schema'
import productApiRequest from '@/services/apiProducts'

interface ToggleCellProps {
  product: ProductItem
  field: 'hot' | 'show' | 'gift'
  onSuccess?: () => void
}

export default function ToggleCell({
  product,
  field,
  onSuccess
}: ToggleCellProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // console.log('product', product)

  // Chuyển đổi giá trị từ number sang boolean
  const currentValue = product[field] === 1

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true)

      // Tạo body update với tất cả trường nhưng chỉ thay đổi trường cần toggle
      const updateBody = {
        thumb: product.thumb,
        name: product.name,
        desc: product.desc,
        tags: product.tags,
        content: product.content,
        price: product.price,
        price_old: product.price_old,
        menus: product.menus,
        point_change: product.point_change,
        // Chuyển đổi các trường cần thiết
        show: product.show === 1 ? true : false,
        hot: product.hot === 1 ? true : false,
        gift: product.gift === 1 ? true : false,
        priority: product.priority,

        suggests: Array.isArray(product.suggests)
          ? product.suggests
          : typeof product.suggests === 'string'
          ? product.suggests.split(',').map(Number)
          : [],
        // Chuyển đổi trường cần toggle
        [field]: checked ? 1 : 0 // Chuyển boolean thành number
      }
      console.log('updateBody', updateBody)
      await productApiRequest.updateProduct(product.id, updateBody)

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
