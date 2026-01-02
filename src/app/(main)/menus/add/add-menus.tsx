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

import { useToast } from '@/contexts/toast-context'

import Grid from '@mui/material/Grid'

import MenuSelect, { MenuItemType } from '@/components/menus/menu-select'
import { useRouter } from 'next/navigation'

import ImageUploadBox from '@/components/menus/image-upload-box'
import TypeSelect from '@/components/menus/type-select'
import {
  CreateMenuBody,
  CreateMenuBodyType,
  MenuItem
} from '@/schemaValidations/menus.schema'
import menuApiRequest from '@/services/apiMenu'

const AddMenuForm = ({ initialMenus }: { initialMenus: MenuItem[] }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading

  const [menus, setMenus] = useState<MenuItemType[]>([])
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateMenuBodyType>({
    resolver: zodResolver(CreateMenuBody),
    defaultValues: {
      name: '',
      thumb: '',
      desc: '',
      inside: 0,
      display_type: 0,
      show: true,
      hot: false,
      order: 0
    }
  })

  useEffect(() => {
    const filteredMenus = initialMenus.map(menu => ({
      id: menu.id,
      name: menu.name
    }))

    setMenus(filteredMenus)
  }, [initialMenus])

  async function onSubmit(values: CreateMenuBodyType) {
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
      <div className='flex flex-col justify-center items-center'>
        <Grid container justifyContent='space-between' spacing={2}>
          <Grid size={12}>
            <Box mb={4}>
              <Controller
                name='thumb'
                control={control}
                render={({ field }) => (
                  <ImageUploadBox
                    label='Ảnh đại diện chuyên mục (nếu có)'
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
                htmlFor='title'>
                Tên chuyên mục
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
                Mô tả chuyên mục
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
                htmlFor='inside'>
                Loại chuyên mục
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
          <Grid size={12}>
            <Button
              sx={{ marginTop: 4 }}
              color='primary'
              variant='contained'
              size='large'
              fullWidth
              type='submit'
              disabled={loading}>
              {loading ? 'Đang thêm chuyên mục...' : 'Thêm chuyên mục'}
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}

export default AddMenuForm
