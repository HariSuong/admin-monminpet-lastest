// app/(main)/products/add/page.tsx

import AddProductForm from '@/app/(main)/products/add/add-product'
import faqApiRequest from '@/services/apiFaq'
import menuApiRequest from '@/services/apiMenu'
import productApiRequest from '@/services/apiProducts'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import { cookies } from 'next/headers'

import React from 'react'

const AddProduct = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''
  try {
    // Fetch tất cả dữ liệu cần thiết
    const [faqsRes, productsRes, menusRes] = await Promise.all([
      faqApiRequest.getFaqs(sessionToken, 1, 100),
      productApiRequest.getProducts(sessionToken, 1, 100),
      menuApiRequest.getMenus(sessionToken, 3, 100)
    ])

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
          Cập nhật thuộc tính
        </Typography>
        <AddProductForm
          initialFaqs={faqsRes.payload.data}
          initialProducts={productsRes.payload.data}
          initialMenus={menusRes.payload}
        />
      </Box>
    )
  } catch {
    console.log('Lỗi')
  }
}

export default AddProduct
