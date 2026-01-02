import UpdateFaqForm from '@/app/(main)/faqs/edit/_component/update-faq'

import { cookies } from 'next/headers'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import React from 'react'
import faqApiRequest from '@/services/apiFaq'

const UpdateFaqPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    // Fetch tất cả dữ liệu cần thiết
    const faqApi = await faqApiRequest.getFaqs(sessionToken, 1, 10, Number(id))

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
          Chỉnh sửa câu hỏi
        </Typography>
        <UpdateFaqForm faq={faqApi.payload.data[0]} />
      </Box>
    )
  } catch {
    console.log('Looix')
  }
}

export default UpdateFaqPage
