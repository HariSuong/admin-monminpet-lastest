import AddMenuForm from '@/app/(main)/menus/add/add-menus'
import menuApiRequest from '@/services/apiMenu'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'
import { cookies } from 'next/headers'

const AddMenu = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''
  try {
    const [menusRes] = await Promise.all([
      menuApiRequest.getAllMenus(sessionToken)
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
          Thêm chuyên mục mới
        </Typography>
        <AddMenuForm initialMenus={menusRes.payload.data} />{' '}
        {/* Truyền dữ liệu từ server */}
      </Box>
    )
  } catch (error) {
    console.error('Error fetching menus:', error)
    return <div>Error loading menus</div>
  }
}

export default AddMenu
