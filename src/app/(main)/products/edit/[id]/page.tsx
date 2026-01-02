// app/(main)/products/edit/[id]/page.tsx


import React from 'react'
import productApiRequest from '@/services/apiProducts'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import UpdateProductForm from '@/app/(main)/products/edit/_component/update-product'
import { cookies } from 'next/headers'
import menuApiRequest from '@/services/apiMenu'
import faqApiRequest from '@/services/apiFaq'

const UpdateProductPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const [productApi, productsRes, faqsRes, menusRes] = await Promise.all([
      productApiRequest.getProducts(sessionToken, 1, 10, Number(id)),
      productApiRequest.getProducts(sessionToken, 1, 100),
      faqApiRequest.getFaqs(sessionToken, 1, 100),
      menuApiRequest.getMenus(sessionToken, 3, 100)
    ])

    // console.log('productApi', productApi)

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
          Thêm sản phẩm mới
        </Typography>
        <UpdateProductForm
          product={productApi.payload.data[0]}
          initialProducts={productsRes.payload.data}
          initialMenus={menusRes.payload}
          initialFaqs={faqsRes.payload.data}
        />
      </Box>
    )
  } catch (error) {
    console.log('Looix', error)
  }
}

export default UpdateProductPage
