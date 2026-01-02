'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useToast } from '@/contexts/toast-context'
import Grid from '@mui/material/Grid'

import ImageUploadBox from '@/components/products/image-upload-box'

import { useRouter } from 'next/navigation'

import AttributeSelect from '@/components/attributes/attribute-select'
import ProductsSelect from '@/components/attributes/product-select'

import { parsePriceString } from '@/libs/formatData'
import {
  CreateAttributeBody,
  CreateAttributeBodyType
} from '@/schemaValidations/attribute.schema'
import { ProductItem } from '@/schemaValidations/product.schema'
import attributeApiRequest from '@/services/apiAttributes'
import productApiRequest from '@/services/apiProducts'

interface AttributeItemType {
  id: number
  name: string
}
const AddAttributeForm = () => {
  const { showToast } = useToast()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [attributes, setAttributes] = useState<AttributeItemType[]>([])

  const [loading, setLoading] = useState(false) // Thêm state loading

  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateAttributeBodyType>({
    resolver: zodResolver(CreateAttributeBody),
    defaultValues: {
      attribute_id: 0,
      name: '',
      product_id: 0,
      price: '',
      image: ''
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, attributesRes] = await Promise.all([
        productApiRequest.getProducts('', 1, 100),
        attributeApiRequest.getAttributes()
      ])
      setProducts(productsRes.payload.data)
      setAttributes(attributesRes.payload.data)
    }
    fetchData()
  }, [])

  async function onSubmit(values: CreateAttributeBodyType) {
    console.log('aaa')
    setLoading(true) // Bắt đầu loading

    const submitData = {
      ...values,
      price: parsePriceString(values.price)
    }

    console.log('submitData:', submitData)
    try {
      const result = await attributeApiRequest.insertAttributes(submitData)
      showToast({
        severity: 'success',
        message: 'Thêm thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      console.log('result', result)
      // await authApiRequest.auth({ sessionToken: result.payload.token })
      // router.push('/account')
      setTimeout(() => {
        router.push('/attributes')
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
        <Grid container justifyContent='space-between' spacing={2}>
          <Grid size={12}>
            <Box mb={4}>
              <Controller
                name='image'
                control={control}
                render={({ field }) => (
                  <ImageUploadBox
                    label='Ảnh thuộc tính'
                    onImageUploaded={imageUrl => {
                      field.onChange(imageUrl) // GÁN URL ảnh vào form
                    }}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='name'>
                Tên thuộc tính
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
                htmlFor='price'>
                Giá thuộc tính sản phẩm
              </Typography>

              <Controller
                name='price'
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
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='attribute_id'>
                Loại thuộc tính
              </Typography>
              <AttributeSelect
                control={control}
                name='attribute_id'
                attributes={attributes}
              />
            </Box>
            <Box mb={2}>
              <Typography
                variant='subtitle1'
                fontWeight={600}
                component='label'
                htmlFor='product_id'>
                Thuộc tính của sản phẩm
              </Typography>
              <ProductsSelect
                control={control}
                name='product_id'
                productList={products}
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
    </form>
  )
}

export default AddAttributeForm
