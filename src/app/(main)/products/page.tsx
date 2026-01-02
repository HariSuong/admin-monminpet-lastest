// app/(main)/products/page.tsx

import ProductList from '@/components/products/list'
import productApiRequest from '@/services/apiProducts'
import { cookies } from 'next/headers'
import React from 'react'

const ProductsPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: products } = await productApiRequest.getProducts(
      sessionToken
    )

    return (
      <div>
        <ProductList initialProducts={products} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return <div>Error loading products</div>
  }
}

export default ProductsPage
