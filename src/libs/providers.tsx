//src/libs/providers.tsx


'use client'

import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { ToastProvider } from '@/contexts/toast-context'
import CssBaseline from '@mui/material/CssBaseline'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
