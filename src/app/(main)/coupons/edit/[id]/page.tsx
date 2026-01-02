import UpdateCouponForm from '@/app/(main)/coupons/edit/_component/update-coupon'

import { cookies } from 'next/headers'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import React from 'react'
import couponApiRequest from '@/services/apiCoupon'
import userApiRequest from '@/services/apiUsers'

const UpdateCouponPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  // const couponApi = await couponApiRequest.getCoupons('', 1, 10, Number(id))

  // console.log('couponApi', couponApi.payload.data[0])

  try {
    // Fetch tất cả dữ liệu cần thiết
    const [couponApi, usersRes] = await Promise.all([
      couponApiRequest.getCoupons(sessionToken, 1, 10, Number(id)),
      userApiRequest.getUsers(sessionToken)
    ])

    console.log('couponApi', couponApi.payload.data[0])

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
          Cập nhật mã giảm giá
        </Typography>
        <UpdateCouponForm
          coupon={couponApi.payload.data[0]}
          users={usersRes.payload.data}
        />
      </Box>
    )
  } catch {
    console.log('Looix')
  }
}

export default UpdateCouponPage
