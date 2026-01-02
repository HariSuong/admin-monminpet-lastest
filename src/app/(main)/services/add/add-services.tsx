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
import { FaqItem } from '@/schemaValidations/faq.schema'

import TypeSelect from '@/components/menus/type-select'
import menuApiRequest from '@/services/apiMenu'
import {
  CreateServiceBody,
  CreateServiceBodyType
} from '@/schemaValidations/services.schema'
import { MenuItem } from '@/schemaValidations/menus.schema'

const AddServiceForm = ({
  initialFaqs,
  initialMenus
}: {
  initialFaqs: FaqItem[]
  initialMenus: MenuItem[]
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading
  const [faqs, setFaqs] = useState<FaqItemType[]>([])
  const [menus, setMenus] = useState<MenuItemType[]>([])
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateServiceBodyType>({
    resolver: zodResolver(CreateServiceBody),
    defaultValues: {
      name: '',

      thumb: '',
      content: '',
      desc: '',
      inside: 0,
      display_type: 0,
      faqs: [],
      show: true,
      hot: false,
      order: 0
    }
  })

  useEffect(() => {
    const filteredFaqs = initialFaqs
      .filter((faq: FaqItem) => faq.show === 1)
      .map(faq => ({ id: faq.id, name: faq.question || '' }))

    const filteredMenus = initialMenus.map(menu => ({
      id: menu.id,
      name: menu.name
    }))

    setMenus(filteredMenus)
    setFaqs(filteredFaqs)
  }, [initialFaqs, initialMenus])

  async function onSubmit(values: CreateServiceBodyType) {
    console.log('aaa')
    setLoading(true) // Bắt đầu loading
    const submitData = {
      ...values
    }

    console.log('submitData:', submitData)
    try {
      const result = await menuApiRequest.insertMenu(submitData)

      showToast({
        severity: 'success',
        message: 'Thêm thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      console.log('result', result)

      setTimeout(() => {
        router.push('/menus')
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
  console.log('test')

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
              htmlFor='inside'>
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
              htmlFor='faqs'>
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
            {loading ? 'Đang thêm dịch vụ...' : 'Thêm dịch vụ'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddServiceForm
