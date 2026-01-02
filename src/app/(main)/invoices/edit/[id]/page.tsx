import invoiceApiRequest from '@/services/apiInvoices'
import { cookies } from 'next/headers'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import React from 'react'
import UpdateInvoiceForm from '@/app/(main)/invoices/edit/_component/update-invoice'

const UpdateInvoicePage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  // const invoiceApi = await invoiceApiRequest.getInvoices('', 1, 10, Number(id))

  // console.log('invoiceApi', invoiceApi.payload.data[0])

  try {
    const invoiceApi = await invoiceApiRequest.getInvoices(
      sessionToken,
      1,
      10,
      Number(id)
    )

    console.log('invoiceApi', invoiceApi.payload.data[0])

    return (
      <Box
        sx={{
          flexGrow: 1,
          padding: '20px',
          // backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginTop: '20px'
          // color: '#333'
        }}>
        <Typography
          variant='h3'
          gutterBottom
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px'
            // color: '#333'
          }}>
          Chỉnh sửa thông tin đơn hàng
        </Typography>
        <UpdateInvoiceForm invoice={invoiceApi.payload.data[0]} />
      </Box>
    )
  } catch {
    console.log('Looix')
  }
}

export default UpdateInvoicePage
