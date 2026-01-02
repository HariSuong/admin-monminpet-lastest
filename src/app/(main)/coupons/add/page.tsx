import AddCouponForm from '@/app/(main)/coupons/add/add-coupon'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

const AddCoupon = () => {
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
        Thêm mã giảm giá mới
      </Typography>
      <AddCouponForm />
    </Box>
  )
}

export default AddCoupon
