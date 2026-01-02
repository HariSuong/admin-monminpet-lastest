import MenuList from '@/components/menus/list'
import menuApiRequest from '@/services/apiMenu'
import { cookies } from 'next/headers'
import React from 'react'

const MenusPage = async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: menus } = await menuApiRequest.getAllMenus(sessionToken)
    console.log('menus', menus)
    return (
      <div>
        <MenuList initialMenus={menus} sessionToken={sessionToken} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching menus:', error)
    return <div>Error loading menus</div>
  }
}

export default MenusPage
