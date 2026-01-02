import AttributeList from '@/components/attributes/list'
import attributeApiRequest from '@/services/apiAttributes'
import { cookies } from 'next/headers'

const AttributesPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: attribute } =
      await attributeApiRequest.getProductAttributes(sessionToken)

    return (
      <div>
        <AttributeList
          initialAttributes={attribute}
          sessionToken={sessionToken}
        />
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return <div>Error loading products</div>
  }
}

export default AttributesPage
