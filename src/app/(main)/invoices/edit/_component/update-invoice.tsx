'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/contexts/toast-context'
import { useRouter } from 'next/navigation'
import {
  Invoice,
  UpdateInvoiceBody,
  UpdateInvoiceBodyType
} from '@/schemaValidations/invoice.schema'
import invoiceApiRequest from '@/services/apiInvoices'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Image from 'next/image'

const UpdateInvoiceForm = ({ invoice }: { invoice: Invoice }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading
  const router = useRouter()
  console.log('invoice', invoice)
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateInvoiceBodyType>({
    resolver: zodResolver(UpdateInvoiceBody),
    defaultValues: {
      name: invoice.name,
      email: invoice.email,
      address: invoice.address,
      phone: invoice.phone,
      message: invoice.message || '',
      note: invoice.note || '',
      paid: invoice.paid === 1,
      delivered: invoice.delivered === 1
    }
  })

  async function onSubmit(values: UpdateInvoiceBodyType) {
    console.log('aaa')
    setLoading(true) // Bắt đầu loading
    const submitData = {
      ...values,
      paid: values.paid === true ? 1 : 0,
      delivered: values.delivered === true ? 1 : 0
    }

    console.log('submitData:', submitData)
    try {
      const result = await invoiceApiRequest.updateInvoice(
        invoice.id,
        submitData
      )
      showToast({
        severity: 'success',
        message: 'Thêm thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      console.log('result', result)

      setTimeout(() => {
        router.push('/invoices')
        router.refresh()
      }, 500) // Chờ 500ms trước khi thực hiện push
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        <Grid size={5}>
          <Typography variant='h6' gutterBottom>
            Giỏ hàng
          </Typography>
          {invoice?.invoice_products.length > 0 ? (
            invoice?.invoice_products.map(item => {
              const attributes = item?.attributes
                ? JSON.parse(item?.attributes)
                : []
              console.log('attributes', attributes)
              return (
                <Card
                  key={item.product_id}
                  className='flex items-center space-x-4'>
                  <CardContent>
                    <div className='flex-shrink-0'>
                      {item.product_thumb && (
                        <Image
                          src={item.product_thumb}
                          alt={item.product_name}
                          width={80}
                          height={80}
                          className='w-20 h-20 object-cover rounded-md'
                        />
                      )}
                    </div>
                    <div>
                      <div className='flex justify-between'>
                        <Typography
                          className='md:text-lg text-base md:font-semibold font-medium'
                          fontWeight={600}>
                          {item.product_name}
                        </Typography>
                        <Typography className='text-sm text-gray-500'>
                          Số lượng: {item.quantity}
                        </Typography>
                      </div>

                      {/* ✅ Phần hiển thị thuộc tính */}
                      {attributes.length > 0 ? (
                        <p className='text-sm text-gray-500'>
                          (<span>Phân loại: {attributes[0]?.name}</span>)
                        </p>
                      ) : null}

                      <Typography className='md:text-xl font-bold'>
                        Giá: {item.price.toLocaleString()}đ
                      </Typography>
                      <Typography className='md:text-xl font-bold'>
                        Thành tiền:{' '}
                        {(item.price * item.quantity).toLocaleString()}đ
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Typography>Không có sản phẩm trong giỏ hàng.</Typography>
          )}
        </Grid>
        <Grid size={7}>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='title'>
              Tên người dùng
            </Typography>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='title'>
              Email
            </Typography>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='title'>
              Số điện thoại
            </Typography>
            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='title'>
              Địa chỉ
            </Typography>
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='title'>
              Lời nhắn
            </Typography>
            <Controller
              name='message'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='title'>
              Ghi chú
            </Typography>
            <Controller
              name='note'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.note}
                  helperText={errors.note?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography variant='subtitle1' fontWeight={600}>
              Các cài đặt khác
            </Typography>

            <Controller
              name='paid'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  }
                  label='Đã thanh toán'
                />
              )}
            />

            <Controller
              name='delivered'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  }
                  label='Đã giao hàng'
                />
              )}
            />
          </Box>

          <Button
            variant='contained'
            color='primary'
            type='submit'
            className='mt-4'
            disabled={loading}
            fullWidth>
            {loading ? 'Đang cập nhật...' : 'Cập nhật đơn hàng'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default UpdateInvoiceForm
