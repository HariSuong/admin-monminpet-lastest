import AddPostForm from '@/app/(main)/posts/add/add-post'
import menuApiRequest from '@/services/apiMenu'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import { cookies } from 'next/headers'

import React from 'react'

const AddPost = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''
  try {
    const menusRes = await menuApiRequest.getMenus(sessionToken, 2, 100)
    const initialMenus = menusRes.payload

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
          Thêm bài viết mới
        </Typography>
        <AddPostForm initialMenus={initialMenus} />{' '}
        {/* Truyền dữ liệu từ server */}
      </Box>
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return <div>Error loading posts</div>
  }
}

export default AddPost
