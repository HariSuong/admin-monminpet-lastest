import AppProvider from '@/app/AppProvider'
import { AppProviders } from '@/libs/providers'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Admin Monminpet',
  description: 'Main application'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  return (
    <html lang='vi' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          {/* <Sidebar />
          <Box
            component='main'
            sx={{
              flexGrow: 1,
              p: 3,
              marginLeft: '256px',
              minHeight: '100vh'
            }}>
            
          </Box> */}
          <AppProvider initialSessionToken={sessionToken}>
            {/* <ClientLayout>{children}</ClientLayout> */}
            {children}
          </AppProvider>
        </AppProviders>
      </body>
    </html>
  )
}
