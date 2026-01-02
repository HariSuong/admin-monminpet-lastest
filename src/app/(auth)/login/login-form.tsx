'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { JSX, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
// import Controller from '@mui/material/Controller'
import { useToast } from '@/contexts/toast-context'
import authApiRequest from '@/services/apiAuth'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useSearchParams } from 'next/navigation'

interface LoginProps {
  title?: string
  subtitle?: JSX.Element | JSX.Element[]
  subtext?: JSX.Element | JSX.Element[]
}

const AuthLogin = ({ title, subtitle, subtext }: LoginProps) => {
  const [loading, setLoading] = useState(false) // Thêm state loading
  const { showToast } = useToast()

  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: LoginBodyType) {
    setLoading(true) // Bắt đầu loading

    try {
      const result = await authApiRequest.login(values)
      showToast({
        severity: 'success',
        message: 'Đăng nhập thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      await authApiRequest.auth({ sessionToken: result.payload.token })
      window.location.href = redirectPath
    } catch (error) {
      const status = (error as { status: number }).status
      if (status === 400) {
        showToast({
          severity: 'error',
          message: 'Lỗi đăng nhập',
          description: 'Email hoặc mật khẩu chưa đúng, vui lòng kiểm tra lại'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {title && (
        <Typography fontWeight='700' variant='h2' mb={1}>
          {title}
        </Typography>
      )}
      {subtext}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='email'
              mb='5px'>
              Email
            </Typography>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Box>
          <Box mt='25px'>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='password'
              mb='5px'>
              Mật khẩu
            </Typography>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <TextField
                  type='password'
                  variant='outlined'
                  fullWidth
                  {...field}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Box>
        </Stack>

        <Box>
          <Button
            sx={{ marginTop: 4 }}
            color='primary'
            variant='contained'
            size='large'
            fullWidth
            type='submit'
            disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Box>
      </form>
      {subtitle}
    </>
  )
}

export default AuthLogin
