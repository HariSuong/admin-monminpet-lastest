import { cookies } from 'next/headers'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import React from 'react'
import menuApiRequest from '@/services/apiMenu'
import faqApiRequest from '@/services/apiFaq'

import UpdateServiceForm from '@/app/(main)/services/edit/_component/update-service'

const UpdateMenuPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  // const menuApi = await menuApiRequest.getMenus('', 1, 10, Number(id))

  // console.log('menuApi', menuApi.payload.data[0])

  try {
    const [faqsRes, menuRes, menusRes] = await Promise.all([
      faqApiRequest.getFaqs(sessionToken, 1, 100),
      menuApiRequest.getAllServices(sessionToken, 1, 10, Number(id)),
      menuApiRequest.getAllServices(sessionToken)
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
          Cập nhật dịch vụ
        </Typography>
        <UpdateServiceForm
          menu={menuRes.payload.data[0]}
          initialFaqs={faqsRes.payload.data}
          initialMenus={menusRes.payload.data}
        />
      </Box>
    )
  } catch {
    console.log('Looix')
  }
}

export default UpdateMenuPage
