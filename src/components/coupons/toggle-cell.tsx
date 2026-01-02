// components/coupons/toggle-cell.tsx
'use client'

import { Switch } from '@mui/material'
import { useState } from 'react'
import { useToast } from '@/contexts/toast-context'

import { CouponItem } from '@/schemaValidations/coupon.schema'
import couponApiRequest from '@/services/apiCoupon'
import { formatToVNDate, parsePriceString } from '@/libs/formatData'

interface ToggleCellProps {
  coupon: CouponItem
  field: 'active'

  onSuccess?: () => void
}

export default function ToggleCell({
  coupon,
  field,
  onSuccess
}: ToggleCellProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Chuyển đổi giá trị từ number sang boolean
  const currentValue = coupon[field] === 1

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true)
      console.log('coupon', coupon)
      /**
       *  code: z.string().min(1).max(256),
         discount: z.number().int(),
         type: z.coerce.number().int(),
         exp_time: z.string(),
         active: z.boolean(),
         count: z.number().int(),
         reached_price: z.number().int(),
         users: z.array(z.number()).optional()
       */
      // Tạo body update với tất cả trường nhưng chỉ thay đổi trường cần toggle
      const updateBody = {
        code: coupon.code || '',
        users:
          coupon.users !== null
            ? coupon.users
                .split(',')
                .map(item => (isNaN(Number(item)) ? undefined : Number(item)))
                .filter((item): item is number => item !== undefined)
            : [],
        discount: Number(coupon.discount),
        count: Number(coupon.count),
        reached_price: parsePriceString(coupon.reached_price.toString()),
        exp_time: formatToVNDate(coupon.exp_time || new Date()) || '',

        type: coupon.type,

        // Chuyển đổi các trường cần thiết
        active: checked
      }
      console.log('updateBody', updateBody)
      await couponApiRequest.updateCoupons(coupon.id, updateBody)

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
