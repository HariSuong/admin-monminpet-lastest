'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useToast } from '@/contexts/toast-context'

import { useRouter } from 'next/navigation'

import TinyMCEEditor from '@/components/tiny-mce'
import {
  CreateFaqBody,
  CreateFaqBodyType
} from '@/schemaValidations/faq.schema'
import faqApiRequest from '@/services/apiFaq'

/**
 *   "attribute_id": "6",
    "name": "20ml",
    "product_id": "5",
    "price": "0",
    "image": ""
 */
const AddFaqForm = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateFaqBodyType>({
    resolver: zodResolver(CreateFaqBody),

    defaultValues: {
      answer: '',
      question: '',
      sort: 0,
      show: true
    }
  })

  async function onSubmit(values: CreateFaqBodyType) {
    console.log('aaa')
    setLoading(true) // Bắt đầu loading

    const submitData = {
      ...values,
      show: values.show ? 1 : 0
    }

    console.log('submitData:', submitData)
    try {
      const result = await faqApiRequest.insertFaqs(submitData)
      showToast({
        severity: 'success',
        message: 'Thêm thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      console.log('result', result)

      setTimeout(() => {
        router.push('/faqs')
        router.refresh()
      }, 500) // Chờ 500ms trước khi thực hiện push
    } catch (error) {
      const status = (error as { status: number }).status
      if (status === 400) {
        showToast({
          severity: 'error',
          message: 'Lỗi thêm thuộc tính',
          description: 'Vui lòng kiểm tra lại thông tin'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col justify-center items-center'>
        <div className='max-w-2xl'>
          <Grid container justifyContent='space-between' spacing={2}>
            <Grid size={12}>
              <Box mb={2}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  component='label'
                  htmlFor='question'>
                  Câu hỏi
                </Typography>
                <Controller
                  name='question'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      variant='outlined'
                      className='!mt-2'
                      fullWidth
                      {...field}
                      error={!!errors.question}
                      helperText={errors.question?.message}
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  component='label'
                  htmlFor='answer'>
                  Câu trả lời
                </Typography>
                <Controller
                  name='answer'
                  control={control}
                  render={({ field }) => (
                    <TinyMCEEditor
                      value={field.value ?? ''}
                      onChange={answer => field.onChange(answer)}
                    />
                  )}
                />
                {errors.answer && (
                  <Typography color='error' variant='caption'>
                    {errors.answer.message}
                  </Typography>
                )}
              </Box>

              <Box mb={2}>
                <Typography
                  variant='subtitle1'
                  fontWeight={600}
                  component='label'
                  htmlFor='sort'>
                  Độ ưu tiên
                </Typography>

                <Controller
                  name='sort'
                  control={control}
                  render={({ field }) => (
                    <Slider
                      {...field}
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                      defaultValue={0}
                      valueLabelDisplay='on'
                      step={1}
                      min={0}
                      max={100}
                      marks
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <Typography variant='subtitle1' fontWeight={600}>
                  Trạng thái
                </Typography>

                <Controller
                  name='show'
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                        />
                      }
                      label='Hiện'
                    />
                  )}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Button
                sx={{ marginTop: 4 }}
                color='primary'
                variant='contained'
                size='large'
                fullWidth
                type='submit'
                disabled={loading}>
                {loading ? 'Đang thêm thuộc tính...' : 'Thêm thuộc tính'}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>{' '}
    </form>
  )
}

export default AddFaqForm
