import attributeApiRequest from '@/services/apiAttributes'
import Box from '@mui/material/Box'
import { cookies } from 'next/headers'

import UpdateAttributeForm from '@/app/(main)/attributes/edit/_component/update-attribute'
import productApiRequest from '@/services/apiProducts'
import Typography from '@mui/material/Typography'

const UpdateAttributePage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  console.log('sessionToken', sessionToken)
  if (!sessionToken) return

  try {
    // Fetch tất cả dữ liệu cần thiết
    const [attributeRes, productsRes, attributesRes] = await Promise.all([
      attributeApiRequest.getProductAttributes(sessionToken, 1, 10, Number(id)),
      productApiRequest.getProducts(sessionToken, 1, 100),
      attributeApiRequest.getAttributes(sessionToken)
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
        <UpdateAttributeForm
          attribute={attributeRes.payload.data[0]}
          products={productsRes.payload.data}
          attributes={attributesRes.payload.data}
        />
      </Box>
    )
  } catch {
    console.log('Lỗi')
  }
}

export default UpdateAttributePage
