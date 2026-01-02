'use client'

import ProductsSelect from '@/components/reviews/product-select'
import { useToast } from '@/contexts/toast-context'
import { ProductItem } from '@/schemaValidations/product.schema'
import {
  CreateReviewBody,
  CreateReviewBodyType,
  ReviewItem
} from '@/schemaValidations/review.schema'
import reviewApiRequest from '@/services/apiReview'
import { zodResolver } from '@hookform/resolvers/zod'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const UpdateReviewForm = ({
  review,
  products
}: {
  review: ReviewItem
  products: ProductItem[]
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Cập nhật state loading
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateReviewBodyType>({
    resolver: zodResolver(CreateReviewBody),
    /**
     * {
  "product_id": 1,
  "invoice_id": "",
  "content": "Mẫu sản phẩm AB 11 1C",
  "rating": 5,
  "invoice_products_id": ""
}

 */
    defaultValues: {
      product_id: review.product_id || undefined,
      invoice_id: review.invoice_id.toString() || '',
      content: review.content,
      rating: review.rating,
      invoice_products_id: review.invoice_products_id.toString()
    }
  })

  async function onSubmit(values: CreateReviewBodyType) {
    setLoading(true) // Bắt đầu loading
    const submitData = {
      ...values
    }

    console.log('submitData:', submitData)

    try {
      const result = await reviewApiRequest.updateReviews(review.id, submitData)
      showToast({
        severity: 'success',
        message: 'Cập nhật thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })
      console.log('result', result)
      setTimeout(() => {
        router.push('/reviews')
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
                htmlFor='rating'>
                Đánh giá sao
              </Typography>
              <Controller
                name='rating'
                control={control}
                render={({ field }) => (
                  <Box mt={1}>
                    <Rating
                      {...field}
                      precision={0.5} // Cho phép 0.5 sao
                      max={5}
                      size='large'
                      value={field.value || 0}
                      onChange={(_, newValue) => field.onChange(newValue)}
                    />
                    {errors.rating && (
                      <Typography color='error' variant='caption'>
                        {errors.rating.message}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            </Box>

            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='content'>
                Nội dung đánh giá
              </Typography>
              <Controller
                name='content'
                control={control}
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    className='!mt-2'
                    fullWidth
                    {...field}
                    error={!!errors.content}
                    helperText={errors.content?.message}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='invoice_id'>
                Id đơn hàng (nếu có)
              </Typography>
              <Controller
                name='invoice_id'
                control={control}
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    className='!mt-2'
                    fullWidth
                    {...field}
                    error={!!errors.invoice_id}
                    helperText={errors.invoice_id?.message}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='product_id'>
                Sản phẩm đánh giá
              </Typography>
              <ProductsSelect
                control={control}
                name='product_id'
                productList={products}
              />
            </Box>
            <Box display='none'>
              <Controller
                name='invoice_products_id'
                control={control}
                render={({ field }) => <input type='hidden' {...field} />}
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
              {loading
                ? 'Đang cập nhật mã khuyến mãi...'
                : 'Cập nhật mã khuyến mãi'}
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}

export default UpdateReviewForm
