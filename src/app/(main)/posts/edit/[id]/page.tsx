import UpdatePostForm from '@/app/(main)/posts/edit/_component/update-post'
import postApiRequest from '@/services/apiPosts'
import { cookies } from 'next/headers'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import React from 'react'
import menuApiRequest from '@/services/apiMenu'

const UpdatePostPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  // const postApi = await postApiRequest.getPosts('', 1, 10, Number(id))

  // console.log('postApi', postApi.payload.data[0])

  try {
    const [menuRes, postsRes] = await Promise.all([
      menuApiRequest.getMenus(sessionToken, 2, 100),
      postApiRequest.getPosts(sessionToken, 1, 10, Number(id))
    ])

    console.log('postApi', postsRes.payload.data[0])

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
        <UpdatePostForm
          initialMenus={menuRes.payload}
          post={postsRes.payload.data[0]}
        />
      </Box>
    )
  } catch {
    console.log('Looix')
  }
}

export default UpdatePostPage
