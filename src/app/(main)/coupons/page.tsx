import CouponList from '@/components/coupons/list'
import couponApiRequest from '@/services/apiCoupon'
import { cookies } from 'next/headers'

const CouponsPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: coupons } = await couponApiRequest.getCoupons(sessionToken)

    return (
      <div>
        <CouponList initialCoupons={coupons} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return <div>Error loading users</div>
  }
}

export default CouponsPage
