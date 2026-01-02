// app/client-layout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import { Box } from '@mui/material'
import React from 'react'

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  // Danh sách các route không hiển thị sidebar
  const noSidebarRoutes = ['/login', '/forgot-password']
  const showSidebar = !noSidebarRoutes.includes(pathname)

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: showSidebar ? '256px' : 0,
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease'
        }}>
        {children}
      </Box>
    </div>
  )
}

export default ClientLayout
