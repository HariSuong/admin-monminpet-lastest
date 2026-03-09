//src/libs/providers.tsx

'use client'

import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { ToastProvider } from '@/contexts/toast-context'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter' // Thêm dòng này

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
