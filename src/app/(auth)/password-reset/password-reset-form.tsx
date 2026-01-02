'use client'

import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'

import { useToast } from '@/contexts/toast-context'

import {
  PassForgotBody,
  PassForgotBodyType,
  PassResetForm,
  PassResetFormType
} from '@/schemaValidations/auth.schema'
import authApiRequest from '@/services/apiAuth'
import { zodResolver } from '@hookform/resolvers/zod'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const PasswordResetForm = () => {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'enterEmail' | 'resetPass'>('enterEmail')
  const [email, setEmail] = useState('')
  const { showToast } = useToast()

  const router = useRouter()

  const emailForm = useForm<PassForgotBodyType>({
    resolver: zodResolver(PassForgotBody),
    defaultValues: {
      email: ''
    }
  })

  const resetForm = useForm<PassResetFormType>({
    resolver: zodResolver(PassResetForm),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: ''
    }
  })

  const handleSubmitEmail = async (values: PassForgotBodyType) => {
    setLoading(true)
    try {
      const res = await authApiRequest.passForgot(values)
      showToast({
        severity: 'success',
        message: res.payload.message,
        description: 'Mã OTP đã được gửi về email của bạn'
      })

      setEmail(values.email)
      setStep('resetPass')
    } catch (error) {
      const status = (error as { status: number }).status
      if (status === 400) {
        showToast({
          severity: 'error',
          message: 'Lỗi gửi yêu cầu',
          description: 'Vui lòng kiểm tra lại email của bạn'
        })
      } else {
        showToast({
          severity: 'error',
          message: 'Lỗi không xác định',
          description: 'Vui lòng thử lại sau'
        })
      }
      console.error('Error submitting email:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReset = async (values: PassResetFormType) => {
    if (values.password !== values.confirmPassword) {
      showToast({
        severity: 'error',
        message: 'Mật khẩu không khớp',
        description: 'Vui lòng nhập lại mật khẩu mới'
      })
      return
    }

    setLoading(true)
    try {
      await authApiRequest.newPass({
        email,
        otp: values.otp,
        password: values.password
      })
      showToast({
        severity: 'success',
        message: 'Đổi mật khẩu thành công',
        description: 'Bạn có thể đăng nhập bằng mật khẩu mới'
      })
      router.push('/login')
    } catch (error) {
      const status = (error as { status: number }).status
      if (status === 400) {
        showToast({
          severity: 'error',
          message: 'Lỗi đổi mật khẩu',
          description: 'Mã OTP hoặc mật khẩu không đúng, vui lòng kiểm tra lại'
        })
      } else {
        showToast({
          severity: 'error',
          message: 'Lỗi không xác định',
          description: 'Vui lòng thử lại sau'
        })
      }
      console.error('Error submitting reset password:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {step === 'enterEmail' ? (
        <form
          key='enterEmail'
          onSubmit={emailForm.handleSubmit(handleSubmitEmail)}
          className='space-y-4'>
          <Box>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='email'
              mb='5px'>
              Nhập email của bạn
            </Typography>
            <Controller
              name='email'
              control={emailForm.control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  {...field}
                  error={!!emailForm.formState.errors.email}
                  helperText={emailForm.formState.errors.email?.message}
                />
              )}
            />
          </Box>
          <div className='text-center w-full my-6'>
            <Button
              sx={{ marginTop: 4 }}
              color='primary'
              variant='contained'
              size='large'
              fullWidth
              type='submit'
              disabled={loading}>
              {loading ? 'Đang gửi...' : 'Yêu cầu đổi mật khẩu'}
            </Button>
          </div>
          <div className='text-center'>
            <Link href='/login' className='italic underline uppercase'>
              đã nhớ ra mật khẩu?
            </Link>
          </div>
        </form>
      ) : (
        <form
          key='resetPass'
          onSubmit={resetForm.handleSubmit(handleSubmitReset)}
          className='space-y-4'>
          <Box>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='otp'
              mb='5px'>
              Nhập mã OTP đã gửi đến email {email}
            </Typography>
            <Controller
              name='otp'
              control={resetForm.control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  {...field}
                  error={!!resetForm.formState.errors.otp}
                  helperText={resetForm.formState.errors.otp?.message}
                />
              )}
            />
          </Box>
          <Box>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='password'
              mb='5px'>
              Mật khẩu mới
            </Typography>
            <Controller
              name='password'
              control={resetForm.control}
              render={({ field }) => (
                <TextField
                  type='password'
                  variant='outlined'
                  fullWidth
                  {...field}
                  error={!!resetForm.formState.errors.password}
                  helperText={resetForm.formState.errors.password?.message}
                />
              )}
            />
          </Box>
          <Box>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='confirmPassword'
              mb='5px'>
              Nhập lại mật khẩu mới
            </Typography>
            <Controller
              name='confirmPassword'
              control={resetForm.control}
              render={({ field }) => (
                <TextField
                  type='password'
                  variant='outlined'
                  fullWidth
                  {...field}
                  error={!!resetForm.formState.errors.confirmPassword}
                  helperText={
                    resetForm.formState.errors.confirmPassword?.message
                  }
                />
              )}
            />
          </Box>

          <div className='text-center w-full my-6'>
            <Button
              sx={{ marginTop: 4 }}
              color='primary'
              variant='contained'
              size='large'
              fullWidth
              type='submit'
              disabled={loading}>
              {loading ? 'Đang đổi mật khẩu...' : 'Xác nhận đổi mật khẩu'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default PasswordResetForm
