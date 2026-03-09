// app/(main)/products/edit/_component/update-product.tsx

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// import TinyMCEEditor from '@/components/tiny-mce'
import TinyMCEEditor from '@/components/editor'

import { useToast } from '@/contexts/toast-context'
import {
  UpdateProductBodyType,
  ProductItem,
  UpdateProductBody
} from '@/schemaValidations/product.schema'
import Grid from '@mui/material/Grid'

import { useRouter } from 'next/navigation'
import ImageUploadBox from '@/components/products/image-upload-box'
import MultiImageUploadBox from '@/components/products/multi-image-upload-box'
import MenuSelect from '@/components/products/menu-select'
import SuggestProductsSelect, {
  ProductItemType
} from '@/components/products/suggest-products-select'

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { formatToVNDateTime, parsePriceString } from '@/libs/formatData'
import productApiRequest from '@/services/apiProducts'
import { MenuItem } from '@/schemaValidations/menus.schema'
import { MenuSelectType } from '@/components/posts/menu-select'
import { FaqItem } from '@/schemaValidations/faq.schema'
import FaqSelect, { FaqItemType } from '@/components/products/faq-select'

const UpdateProductForm = ({
  product,
  initialMenus,
  initialProducts,
  initialFaqs
}: {
  product: ProductItem
  initialMenus: MenuItem[]
  initialProducts: ProductItem[]
  initialFaqs: FaqItem[]
}) => {
  const { showToast } = useToast()
  const [menus, setMenus] = useState<MenuSelectType[]>([]) // Thêm state loading
  const [products, setProducts] = useState<ProductItemType[]>([])
  const [faqs, setFaqs] = useState<FaqItemType[]>([])

  const [loading, setLoading] = useState(false) // Thêm state loading
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateProductBodyType>({
    resolver: zodResolver(UpdateProductBody),
    defaultValues: {
      name: product.name,
      tags: product.tags,
      thumb: product.thumb,
      content: product.content,
      desc: product.desc,
      imgs: Array.isArray(product.imgs)
        ? product.imgs.toString()
        : product.imgs,
      code: product.code,
      price: String(product.price),
      price_old: String(product.price_old),
      point_change: String(product.point_change),
      menus: product.menus
        .split(',')
        .map(item => (isNaN(Number(item)) ? undefined : Number(item))),
      classify: product.classify,
      bestseller: product.bestseller.toString(),
      // stock: 0,
      gift: product.gift === 1 ? true : false,
      show: product.show === 1 ? true : false,
      hot: product.hot === 1 ? true : false,
      countdown_timer: product.countdown_timer
        ? dayjs(product.countdown_timer).toDate()
        : dayjs().toDate(),
      priority: product.priority,
      faqs: product.faqs
        ? product.faqs
            .split(',')
            .map(item => (isNaN(Number(item)) ? undefined : Number(item)))
            .filter(item => item !== undefined)
        : [],
      // stock_import: 0,
      suggests: product.suggests
        ? product.suggests
            .split(',')
            .map(item => (isNaN(Number(item)) ? undefined : Number(item)))
            .filter(item => item !== undefined)
        : undefined
    }
  })

  useEffect(() => {
    const filteredProducts = initialProducts
      .filter((product: ProductItem) => product.show === 1)
      .map(product => ({ id: product.id, name: product.name }))

    const filteredFaqs = initialFaqs
      .filter((faq: FaqItem) => faq.show === 1)
      .map(faq => ({ id: faq.id, name: faq.question || '' }))

    const filteredMenus = initialMenus.map(menu => ({
      id: menu.id,
      name: menu.name
    }))

    setMenus(filteredMenus)
    setFaqs(filteredFaqs)

    setProducts(filteredProducts)
  }, [initialProducts, initialFaqs, initialMenus])

  async function onSubmit(values: UpdateProductBodyType) {
    console.log('aaa')
    setLoading(true) // Bắt đầu loading
    const submitData = {
      ...values,
      price: parsePriceString(values.price),
      price_old: parsePriceString(values.price_old || '0'),
      point_change: parsePriceString(values.point_change || '0'),
      bestseller: Number(values.bestseller || '0'),

      menus: Array.isArray(values.menus)
        ? values.menus.join(',')
        : values.menus,
      countdown_timer: formatToVNDateTime(values.countdown_timer || new Date())
    }

    console.log('submitData:', submitData)
    try {
      const result = await productApiRequest.updateProduct(
        product.id,
        submitData
      )
      showToast({
        severity: 'success',
        message: 'Cập nhật thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      console.log('result', result)

      setTimeout(() => {
        router.push('/products')
        router.refresh()
      }, 500) // Chờ 500ms trước khi thực hiện push
    } catch (error) {
      const status = (error as { status: number }).status
      if (status === 400) {
        showToast({
          severity: 'error',
          message: 'Lỗi cập nhật',
          description: 'Xin liên hệ it để kiểm tra lại'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='name'>
              Tên sản phẩm
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
              htmlFor='desc'>
              Mô tả sản phẩm
            </Typography>
            <Controller
              name='desc'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  multiline
                  rows={4}
                  fullWidth
                  {...field}
                  error={!!errors.desc}
                  helperText={errors.desc?.message}
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='tags'>
              Từ khóa
            </Typography>
            <Controller
              name='tags'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.tags}
                  helperText={errors.tags?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='content'>
              Nội dung sản phẩm
            </Typography>
            <Controller
              name='content'
              control={control}
              render={({ field }) => (
                <TinyMCEEditor
                  value={field.value}
                  onChange={content => field.onChange(content)}
                />
              )}
            />
            {errors.content && (
              <Typography color='error' variant='caption'>
                {errors.content.message}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid size={4}>
          <Box mb={4}>
            <Controller
              name='thumb'
              control={control}
              render={({ field }) => (
                <ImageUploadBox
                  label='Ảnh đại diện sản phẩm'
                  defaultImage={field.value}
                  onImageUploaded={imageUrl => {
                    field.onChange(imageUrl) // GÁN URL ảnh vào form
                  }}
                />
              )}
            />
          </Box>
          <Box mb={4}>
            <Controller
              name='imgs'
              control={control}
              render={({ field }) => (
                <MultiImageUploadBox
                  defaultImages={
                    Array.isArray(field.value)
                      ? field.value
                      : field.value.split(',')
                  }
                  label='Ảnh chi tiết sản phẩm (nhiều ảnh)'
                  onImagesUploaded={urls => field.onChange(urls)}
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='content'>
              Mã sản phẩm
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
              htmlFor='classify'>
              Phân loại sản phẩm
            </Typography>
            <Controller
              name='classify'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.classify}
                  helperText={errors.classify?.message}
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='bestseller'>
              Số lượng đã bán
            </Typography>
            <Controller
              name='bestseller'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.bestseller}
                  helperText={errors.bestseller?.message}
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
              Giá sản phẩm
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
              htmlFor='price_old'>
              Giá gốc
            </Typography>
            <Controller
              name='price_old'
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
                  error={!!errors.price_old}
                  helperText={errors.price_old?.message}
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='point_change'>
              Điểm đổi thưởng
            </Typography>
            <Controller
              name='point_change'
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
                  suffix={' điểm'}
                  onValueChange={values => {
                    field.onChange(values.floatValue || '')
                  }}
                  className='!mt-2'
                  fullWidth
                  error={!!errors.point_change}
                  helperText={errors.point_change?.message}
                />
              )}
            />
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='menus'>
              Danh mục sản phẩm
            </Typography>
            <MenuSelect control={control} name='menus' menus={menus} />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='suggests'>
              Sản phẩm gợi ý
            </Typography>
            <SuggestProductsSelect
              control={control}
              name='suggests'
              products={products}
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='faq'>
              Câu hỏi (nếu có)
            </Typography>
            <FaqSelect control={control} name='faqs' faqs={faqs} />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='slider'>
              Độ ưu tiên
            </Typography>

            <Controller
              name='priority'
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
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='countdown_timer'>
              Thời gian đếm ngược
            </Typography>

            <Controller
              name='countdown_timer'
              control={control}
              render={({ field }) => (
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      // label='Chọn thời gian'
                      value={dayjs(field.value)} // field.value là Date => cần chuyển về dayjs
                      onChange={val => field.onChange(val?.toDate())} // chuyển dayjs -> Date
                      className='!mt-2 w-full'
                    />
                  </LocalizationProvider>
                </div>
              )}
            />
            {errors.countdown_timer && (
              <Typography variant='body2' color='error'>
                {errors.countdown_timer.message}
              </Typography>
            )}
          </Box>
          <Box mb={2}>
            <Typography variant='subtitle1' fontWeight={600}>
              Các cài đặt khác
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

            <Controller
              name='hot'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  }
                  label='Nổi bật'
                />
              )}
            />

            <Controller
              name='gift'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  }
                  label='Quà tặng'
                />
              )}
            />
          </Box>
        </Grid>
        <Grid size={8}>
          <Button
            sx={{ marginTop: 4 }}
            color='primary'
            variant='contained'
            size='large'
            fullWidth
            type='submit'
            disabled={loading}>
            {loading ? 'Đang cập nhật sản phẩm...' : 'Cập nhật sản phẩm'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default UpdateProductForm
