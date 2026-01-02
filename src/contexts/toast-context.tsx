// src/contexts/toast-context.tsx

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Alert, Snackbar } from '@mui/material'

type ToastType = {
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
  description?: string
}

type ToastContextType = {
  showToast: (toast: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastType | null>(null)
  const [open, setOpen] = useState(false)

  const showToast = (newToast: ToastType) => {
    setToast(newToast)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={handleClose}
          severity={toast?.severity}
          variant='filled'
          sx={{ width: '100%', alignItems: 'center' }}>
          <div>
            <strong>{toast?.message}</strong>
            {toast?.description && (
              <div style={{ fontSize: '0.875rem', marginTop: 4 }}>
                {toast.description}
              </div>
            )}
          </div>
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
