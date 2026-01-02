import Box from '@mui/material/Box'
import { cookies } from 'next/headers'

import productApiRequest from '@/services/apiProducts'
import reviewApiRequest from '@/services/apiReview'
import Typography from '@mui/material/Typography'
import UpdateReviewForm from '@/app/(main)/reviews/edit/_component/update-review'

const UpdateReviewPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    // Fetch tất cả dữ liệu cần thiết
    const [reviewApi, usersRes] = await Promise.all([
      reviewApiRequest.getReviews(sessionToken, 1, 10, Number(id)),
      productApiRequest.getProducts(sessionToken, 1, 100)
    ])

    // console.log('reviewApi', reviewApi.payload.data[0])

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
        <UpdateReviewForm
          review={reviewApi.payload.data[0]}
          products={usersRes.payload.data}
        />
      </Box>
    )
  } catch {
    console.log('Looix')
  }
}

export default UpdateReviewPage
