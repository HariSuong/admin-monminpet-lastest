import Box from '@mui/material/Box'
import { cookies } from 'next/headers'

import UpdateMenuForm from '@/app/(main)/menus/edit/_component/update-menu'
import menuApiRequest from '@/services/apiMenu'
import Typography from '@mui/material/Typography'

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
    const [menuRes, menusRes] = await Promise.all([
      menuApiRequest.getAllMenus(sessionToken, 1, 10, Number(id)),
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
          Cập nhật chuyên mục
        </Typography>
        <UpdateMenuForm
          menu={menuRes.payload.data[0]}
          initialMenus={menusRes.payload.data}
        />
      </Box>
    )
  } catch {
    console.log('Looix')
  }
}

export default UpdateMenuPage
