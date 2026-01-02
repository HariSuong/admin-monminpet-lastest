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
import LinearProgress from '@mui/material/LinearProgress'

import TinyMCEEditor from '@/components/tiny-mce'
import { useToast } from '@/contexts/toast-context'
import {
  CreatePostBody,
  CreatePostBodyType
} from '@/schemaValidations/post.schema'
import Grid from '@mui/material/Grid'

import { useRouter } from 'next/navigation'

import ImageUploadBox from '@/components/posts/image-upload-box'

import postApiRequest from '@/services/apiPosts'
import MenuSelect, { MenuSelectType } from '@/components/posts/menu-select'
import { MenuItem } from '@/schemaValidations/menus.schema'
import { checkSEO } from '@/libs/checkseo'

const AddPostForm = ({ initialMenus }: { initialMenus: MenuItem[] }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false) // Thêm state loading
  const [menus, setMenus] = useState<MenuSelectType[]>([]) // Thêm state loading

  const [seoResult, setSeoResult] = useState<string[]>([])
  const [seoScore, setSeoScore] = useState<number | null>(null)

  console.log('initialMenus', initialMenus)
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<CreatePostBodyType>({
    resolver: zodResolver(CreatePostBody),
    defaultValues: {
      title: '',
      keywords: '',
      thumb: '',
      content: '',
      desc: '',
      menus: [],
      show: true,
      hot: false,
      priority: 0
    }
  })

  useEffect(() => {
    const filteredMenus = initialMenus.map(menus => ({
      id: menus.id,
      name: menus.name
    }))

    setMenus(filteredMenus)
  }, [initialMenus])

  async function onSubmit(values: CreatePostBodyType) {
    console.log('aaa')
    setLoading(true) // Bắt đầu loading
    const submitData = {
      ...values,
      menus: Array.isArray(values.menus) ? values.menus.join(',') : values.menus
    }

    console.log('submitData:', submitData)
    try {
      const result = await postApiRequest.insertPost(submitData)
      showToast({
        severity: 'success',
        message: 'Thêm thành công',
        description: 'Vui lòng đợi chuyển hướng trong giây lát'
      })

      console.log('result', result)

      setTimeout(() => {
        router.push('/posts')
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

  const handleCheckSEO = () => {
    const values = getValues()
    const results = checkSEO({
      title: values.title,
      desc: values.desc,
      keywords: values.keywords,
      content: values.content
    })
    setSeoResult(results)

    // Tính điểm SEO
    const total = results.length
    const passed = results.filter(
      r => r.startsWith('✅') || r.startsWith('🎉')
    ).length
    const score = Math.round((passed / total) * 100)
    setSeoScore(score)

    if (total === 1 && results[0].includes('🎉')) {
      showToast({
        severity: 'success',
        message: 'Bài viết đạt chuẩn SEO',
        description: results[0]
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Button variant='outlined' onClick={handleCheckSEO}>
            🧠 Kiểm tra SEO
          </Button>
          {seoScore !== null && (
            <Box mt={2}>
              <Typography variant='body2' fontWeight={600}>
                🔵 Điểm SEO: {seoScore}/100
              </Typography>
              <LinearProgress
                variant='determinate'
                value={seoScore}
                sx={{ height: 10, borderRadius: 5, my: 1 }}
                color={
                  seoScore >= 80
                    ? 'success'
                    : seoScore >= 50
                    ? 'warning'
                    : 'error'
                }
              />
            </Box>
          )}
          <Box mt={2}>
            {seoResult.map((line, idx) => {
              const isGood = line.startsWith('✅') || line.startsWith('🎉')
              const isBad = line.startsWith('❌')
              const color = isGood
                ? 'success.main'
                : isBad
                ? 'error.main'
                : 'warning.main'
              return (
                <Typography key={idx} variant='body2' sx={{ color }}>
                  {line}
                </Typography>
              )
            })}
          </Box>

          <Box mb={2}>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              component='label'
              htmlFor='title'>
              Tên bài viết
            </Typography>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.title}
                  helperText={errors.title?.message}
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
              Mô tả bài viết
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
              htmlFor='keywords'>
              Từ khóa
            </Typography>
            <Controller
              name='keywords'
              control={control}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  className='!mt-2'
                  fullWidth
                  {...field}
                  error={!!errors.keywords}
                  helperText={errors.keywords?.message}
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
              Nội dung bài viết
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
                  label='Ảnh đại diện bài viết'
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
              htmlFor='menus'>
              Danh mục bài viết
            </Typography>
            <MenuSelect control={control} name='menus' menus={menus} />
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
            {loading ? 'Đang thêm bài viết...' : 'Thêm bài viết'}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default AddPostForm
