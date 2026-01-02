'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'

import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useToast } from '@/contexts/toast-context'
import Grid from '@mui/material/Grid'

import { useRouter } from 'next/navigation'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import UsersSelect from '@/components/coupons/user-select'
import { formatToVNDate, parsePriceString } from '@/libs/formatData'
import {
  CreateCouponBody,
  CreateCouponBodyType
} from '@/schemaValidations/coupon.schema'
import couponApiRequest from '@/services/apiCoupon'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { UserItem } from '@/schemaValidations/user.schema'
import userApiRequest from '@/services/apiUsers'
import { NumericFormat } from 'react-number-format'
const AddCouponForm = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateCouponBodyType>({
    resolver: zodResolver(CreateCouponBody),
    /**{
    "code": "MONMIN60",
    "discount": 60000,
    "type": 0,
    "exp_time": "2025-07-31",
    "active": true,
    "count": 20,
    "reached_price": 998000,
    "users":""
}
 */
    defaultValues: {
      code: '',
      discount: '0',
      type: 0,
      exp_time: new Date(),
      active: true,
      count: '0',
      reached_price: '',
      users: []
    }
  })
  const [users, setUsers] = useState<UserItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await userApiRequest.getUsers()
      setUsers(res.payload.data)
    }
    fetchData()
  }, [])

  async function onSubmit(values: CreateCouponBodyType) {
    setLoading(true) // Bắt đầu loading
    const submitData = {
      ...values,

      // users: Array.isArray(values.users) ? values.users.join(',') : '',
      discount: Number(values.discount),
      count: Number(values.count),
      reached_price: parsePriceString(values.reached_price),
      exp_time: formatToVNDate(values.exp_time || new Date()) || ''
    }

    console.log('submitData:', submitData)

    try {
      const result = await couponApiRequest.insertCoupons(submitData)
      showToast({
        severity: 'success',
        message: 'Thêm thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })
      console.log('result', result)
      setTimeout(() => {
        router.push('/coupons')
        router.refresh()
      }, 500) // Chờ 500ms trước khi thực hiện push
    } catch (error) {
      const status = (error as { status: number }).status
      if (status === 400) {
        showToast({
          severity: 'error',
          message: 'Lỗi đăng nhập',
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
        <Grid container justifyContent='space-between' spacing={2}>
          <Grid size={12}>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='code'>
                Mã giảm giá
              </Typography>
              <Controller
                name='code'
                control={control}
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    className='!mt-2'
                    fullWidth
                    {...field}
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='exp_time'>
                Thời gian hết hạn
              </Typography>

              <Controller
                name='exp_time'
                control={control}
                render={({ field }) => (
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        // label='Chọn thời gian'
                        value={dayjs(field.value)} // field.value là Date => cần chuyển về dayjs
                        onChange={val => field.onChange(val?.toDate())} // chuyển dayjs -> Date
                        className='!mt-2 w-full'
                      />
                    </LocalizationProvider>
                  </div>
                )}
              />
              {errors.exp_time && (
                <Typography variant='body2' color='error'>
                  {errors.exp_time.message}
                </Typography>
              )}
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'>
                Loại
              </Typography>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth className='!mt-2'>
                    <Select
                      labelId='gender-label'
                      id='type'
                      value={field.value}
                      onChange={field.onChange}>
                      <MenuItem value={1}>VND</MenuItem>
                      <MenuItem value={0}>%</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.type && (
                <Typography variant='body2' color='error'>
                  {errors.type.message}
                </Typography>
              )}
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'>
                Giảm giá
              </Typography>
              <Controller
                name='discount'
                control={control}
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    className='!mt-2'
                    fullWidth
                    {...field}
                    error={!!errors.discount}
                    helperText={errors.discount?.message}
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'>
                Giới hạn voucher
              </Typography>
              <Controller
                name='count'
                control={control}
                render={({ field }) => (
                  <TextField
                    type='text'
                    variant='outlined'
                    className='!mt-2'
                    fullWidth
                    {...field}
                    error={!!errors.count}
                    helperText={errors.count?.message}
                  />
                )}
              />
            </Box>

            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'>
                Giá trị đơn hàng tối thiểu
              </Typography>
              <Controller
                name='reached_price'
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    {...field}
                    customInput={TextField}
                    type='text'
                    value={field.value}
                    allowNegative={false}
                    thousandSeparator='.'
                    decimalSeparator=','
                    suffix={'đ'}
                    onValueChange={values => {
                      field.onChange(values.floatValue || '')
                    }}
                    className='!mt-2'
                    fullWidth
                    error={!!errors.reached_price}
                    helperText={errors.reached_price?.message}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Typography variant='subtitle1' fontWeight={600}>
                Trạng thái
              </Typography>

              <Controller
                name='active'
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
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='users'>
                Người dùng
              </Typography>
              <UsersSelect control={control} name='users' userList={users} />
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
              {loading ? 'Đang thêm mã giảm giá...' : 'Thêm mã giảm giá'}
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}

export default AddCouponForm
