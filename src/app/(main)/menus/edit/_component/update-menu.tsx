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
  MenuItem,
  UpdateMenuBody,
  UpdateMenuBodyType
} from '@/schemaValidations/menus.schema'
import menuApiRequest from '@/services/apiMenu'

const UpdateMenuForm = ({
  menu,
  initialMenus
}: {
  menu: MenuItem

  initialMenus: MenuItem[]
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading

  const [menus, setMenus] = useState<MenuItemType[]>([])
  const router = useRouter()
  console.log('menu', menu)
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateMenuBodyType>({
    resolver: zodResolver(UpdateMenuBody),
    defaultValues: {
      name: menu.name,
      // keywords: menu.keywords,
      thumb: menu.thumb,
      desc: menu.desc,
      inside: menu.inside,
      display_type: Number(menu.display_type),

      show: Number(menu.show) === 1 ? true : false,
      hot: Number(menu.hot) === 1 ? true : false,
      order: menu.order
    }
  })

  useEffect(() => {
    const filteredMenus = initialMenus.map(menu => ({
      id: menu.id,
      name: menu.name
    }))

    setMenus(filteredMenus)
  }, [initialMenus])

  async function onSubmit(values: UpdateMenuBodyType) {
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
        router.push('/menus')
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
                Mô tả
              </Typography>
              <Controller
                name='desc'
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
                htmlFor='display_type'>
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
          <Grid size={12}>
            <Button
              sx={{ marginTop: 4 }}
              color='primary'
              variant='contained'
              size='large'
              fullWidth
              type='submit'
              disabled={loading}>
              {loading ? 'Đang cập nhật chuyên mục...' : 'Cập nhật chuyên mục'}
            </Button>
          </Grid>
        </Grid>
      </div>
    </form>
  )
}

export default UpdateMenuForm

