import ReviewList from '@/components/reviews/list'
import reviewApiRequest from '@/services/apiReview'

import { cookies } from 'next/headers'

const ReviewsPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: reviews } = await reviewApiRequest.getReviews(sessionToken)

    return (
      <div>
        <ReviewList initialReviews={reviews} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return <div>Error loading users</div>
  }
}

export default ReviewsPage
