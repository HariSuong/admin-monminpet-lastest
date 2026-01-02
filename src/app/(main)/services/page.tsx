import ServicesList from '@/components/services/list'
import menuApiRequest from '@/services/apiMenu'
import { cookies } from 'next/headers'

const MenusPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: services } = await menuApiRequest.getAllServices(
      sessionToken
    )
    console.log('services', services)
    return (
      <div>
        <ServicesList initialServices={services} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching services:', error)
    return <div>Error loading services</div>
  }
}

export default MenusPage
