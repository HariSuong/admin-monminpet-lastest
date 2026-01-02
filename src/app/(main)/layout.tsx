// import React from 'react'
// import Sidebar from '@/components/sidebar'
// import Box from '@mui/material/Box'
// import AppProvider from '@/app/AppProvider'
// import { cookies } from 'next/headers'

// const MainLayout: React.FC<{ children: React.ReactNode }> = async ({
//   children
// }) => {
//   const cookieStore = await cookies()
//   const sessionToken = cookieStore.get('sessionToken')?.value || ''

//   return (
//     <div>
//       {' '}
//       <Sidebar />
//       <Box
//         component='main'
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           marginLeft: '256px',
//           minHeight: '100vh'
//         }}>
//         <AppProvider initialSessionToken={sessionToken}>{children}</AppProvider>
//       </Box>
//     </div>
//   )
// }

// export default MainLayout

// app/(main)/layout.tsx
import React from 'react'
import Sidebar from '@/components/sidebar'
import Box from '@mui/material/Box'


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    // Sử dụng fragment <> để giữ nguyên cấu trúc kế thừa
    <>
      <Sidebar />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: '256px',
          minHeight: '100vh'
        }}>
        {children} {/* Không wrap thêm provider nếu đã có trong layout gốc */}
      </Box>
    </>
  )
}

export default MainLayout
