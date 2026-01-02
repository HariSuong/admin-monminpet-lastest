// components/invoices/toggle-cell.tsx
'use client'

import { Switch } from '@mui/material'
import { useState } from 'react'
import { useToast } from '@/contexts/toast-context'

import { Invoice } from '@/schemaValidations/invoice.schema'
import invoiceApiRequest from '@/services/apiInvoices'

interface ToggleCellProps {
  invoice: Invoice
  field: 'paid' | 'delivered'

  onSuccess?: () => void
}

export default function ToggleCell({
  invoice,
  field,
  onSuccess
}: ToggleCellProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Chuyển đổi giá trị từ number sang boolean
  const currentValue = invoice[field] === 1

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true)
      console.log('invoice', invoice)

      /**
       * name: z.string().min(1),
         email: z.string().email(),
         address: z.string().min(1),
         phone: z.string().min(1),
         message: z.string().optional(),
         note: z.string().optional(),
         paid: z.boolean(), // Chỉ chấp nhận 0 hoặc 1
         delivered: z.boolean() // Chỉ chấp nhận 0 hoặc 1
       */
      // Tạo body update với tất cả trường nhưng chỉ thay đổi trường cần toggle
      const updateBody = {
        name: invoice.name,
        email: invoice.email,
        address: invoice.address,
        phone: invoice.phone,
        message: invoice.message,
        note: invoice.note,

        // Chuyển đổi các trường cần thiết
        paid: invoice.paid === 1 ? 1 : 0,
        delivered: invoice.delivered === 1 ? 1 : 0,
        [field]: checked ? 1 : 0
      }
      console.log('updateBody', updateBody)
      await invoiceApiRequest.updateInvoice(invoice.id, updateBody)

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
