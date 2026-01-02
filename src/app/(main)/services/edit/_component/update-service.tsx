'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import TinyMCEEditor from '@/components/tiny-mce'
import { useToast } from '@/contexts/toast-context'

import Grid from '@mui/material/Grid'

import MenuSelect, { MenuItemType } from '@/components/menus/menu-select'
import { useRouter } from 'next/navigation'

import FaqSelect, { FaqItemType } from '@/components/menus/faq-select'
import ImageUploadBox from '@/components/menus/image-upload-box'
import TypeSelect from '@/components/menus/type-select'
import { FaqItem } from '@/schemaValidations/faq.schema'

import {
  ServiceItem,
  UpdateServiceBody,
  UpdateServiceBodyType
} from '@/schemaValidations/services.schema'
import menuApiRequest from '@/services/apiMenu'

const UpdateServiceForm = ({
  menu,
  initialFaqs,
  initialMenus
}: {
  menu: ServiceItem
  initialFaqs: FaqItem[]
  initialMenus: ServiceItem[]
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading
  const [faqs, setFaqs] = useState<FaqItemType[]>([])
  const [menus, setMenus] = useState<MenuItemType[]>([])
  const router = useRouter()
  console.log('menu', menu)
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateServiceBodyType>({
    resolver: zodResolver(UpdateServiceBody),
    defaultValues: {
      name: menu.name,

      thumb: menu.thumb,
      content: menu.content,
      desc: menu.desc,
      inside: menu.inside,
      display_type: Number(menu.display_type),
      sub_content: menu.sub_content || '',
      faqs: menu.faqs
        ? menu.faqs
            .split(',')
            .map(item => (isNaN(Number(item)) ? undefined : Number(item)))
            .filter(item => item !== undefined)
        : [],
      show: Number(menu.show) === 1 ? true : false,
      hot: Number(menu.hot) === 1 ? true : false,
      order: menu.order
    }
  })

  useEffect(() => {
    const filteredFaqs = initialFaqs
      .filter((faq: FaqItem) => faq.show === 1)
      .map(faq => ({ id: faq.id, name: faq.question || '' }))

    const filteredServices = initialMenus.map(menu => ({
      id: menu.id,
      name: menu.name
    }))

    setMenus(filteredServices)
    setFaqs(filteredFaqs)
  }, [initialFaqs, initialMenus])

  async function onSubmit(values: UpdateServiceBodyType) {
    console.log('aaa')
    setLoading(true) // Bắt đầu loading
    const submitData = {
      ...values
    }

    console.log('submitData:', submitData)
    try {
      const result = await menuApiRequest.updateMenu(menu.id, submitData)

      showToast({
        severity: 'success',
        message: 'Cập nhật thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      console.log('result', result)

      setTimeout(() => {
        router.push('/services')
        router.refresh()
      }, 500) // Chờ 500ms trước khi thực hiện push
    } catch (error) {
      const status = (error as { status: number }).status
      if (status === 422) {
        showToast({
          severity: 'error',
          message: 'Lỗi cập nhật',
          description: 'Vui lòng kiểm tra lại thông tin'
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
              htmlFor='title'>
              Tên dịch vụ
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
              Mô tả dịch vụ
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
              htmlFor='sub_content'>
              Nội dung phụ
            </Typography>
            <Controller
              name='sub_content'
              control={control}
              render={({ field }) => (
                <TinyMCEEditor
                  value={field.value || ''}
                  onChange={sub_content => field.onChange(sub_content)}
                />
              )}
            />
            {errors.sub_content && (
              <Typography color='error' variant='caption'>
                {errors.sub_content.message}
              </Typography>
            )}
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='content'>
              Nội dung dịch vụ
            </Typography>
            <Controller
              name='content'
              control={control}
              render={({ field }) => (
                <TinyMCEEditor
                  value={field.value || ''}
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
                  label='Ảnh đại diện dịch vụ'
                  defaultImage={menu.thumb}
                  onImageUploaded={(imageUrl: string) => {
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
              htmlFor='display_type'>
              Loại dịch vụ
            </Typography>
            <TypeSelect
              control={control}
              name='display_type'
              types={[
                {
                  id: 2,
                  name: 'Bài viết'
                },
                {
                  id: 3,
                  name: 'Sản phẩm'
                },
                {
                  id: 4,
                  name: 'Dịch vụ'
                }
              ]}
            />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='inside'>
              Chuyên mục cha
            </Typography>
            <MenuSelect control={control} name='inside' menus={menus} />
          </Box>
          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='faq'>
              Câu hỏi
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
              name='order'
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
              Các cài đặt khác
            </Typography>

            <Controller
              name='show'
              control={control}
              render={({ field }) => {
                console.log('field', field.value)
                return (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                      />
                    }
                    label='Hiện'
                  />
                )
              }}
            />

            <Controller
              name='hot'
              control={control}
              render={({ field }) => {
                console.log('field', field.value)
                return (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                      />
                    }
                    label='Nổi bật'
                  />
                )
              }}
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
            {loading ? 'Đang cập nhật dịch vụ...' : 'Cập nhật dịch vụ'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default UpdateServiceForm

// ĐÁNG CHÚ Ý IMAGE
//  31
