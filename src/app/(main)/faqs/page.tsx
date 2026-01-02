import FaqList from '@/components/faq/list'
import faqApiRequest from '@/services/apiFaq'
import { cookies } from 'next/headers'

const FaqsPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: faq } = await faqApiRequest.getFaqs(sessionToken)

    return (
      <div>
        <FaqList initialFaqs={faq} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return <div>Error loading products</div>
  }
}

export default FaqsPage
