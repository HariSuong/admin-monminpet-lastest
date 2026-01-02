// src/components/logout-button.tsx

'use client'

import { useToast } from '@/contexts/toast-context'
import authApiRequest from '@/services/apiAuth'
import { Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const LogoutButton = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      await authApiRequest.logoutFrClientToNextServer()
      router.push('/login')
      // Đợi chuyển hướng xong mới hiển thị toast
      setTimeout(() => {
        showToast({
          severity: 'success',
          message: 'Đăng xuất thành công'
        })
      }, 300)
    } catch {
      showToast({
        severity: 'error',
        message: 'Lỗi đăng xuất'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      sx={{ marginTop: 4 }}
      color='primary'
      variant='contained'
      size='large'
      fullWidth
      type='submit'
      onClick={handleLogout}
      disabled={loading}
      startIcon={loading && <CircularProgress size={20} color='inherit' />}>
      {loading ? 'Đang đăng xuất...' : 'Logout'}
    </Button>
  )
}

export default LogoutButton
