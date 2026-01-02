// components/posts/toggle-cell.tsx
'use client'

import { Switch } from '@mui/material'
import { useState } from 'react'
import { useToast } from '@/contexts/toast-context'
import postApiRequest from '@/services/apiPosts'
import { PostItem } from '@/schemaValidations/post.schema'

interface ToggleCellProps {
  post: PostItem
  field: 'hot' | 'show'

  onSuccess?: () => void
}

export default function ToggleCell({
  post,
  field,
  onSuccess
}: ToggleCellProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  // Chuyển đổi giá trị từ number sang boolean
  const currentValue = post[field] === 1

  const handleChange = async (checked: boolean) => {
    try {
      setLoading(true)
      console.log('post', post)
      // Tạo body update với tất cả trường nhưng chỉ thay đổi trường cần toggle
      const updateBody = {
        thumb: post.thumb,
        title: post.title,
        desc: post.desc,
        content: post.content,
        keywords: post.keywords,
        priority: post.priority,
        menus: post.menus,

        // Chuyển đổi các trường cần thiết
        show: post.show === 1 ? true : false,
        hot: post.hot === 1 ? true : false,
        [field]: checked ? 1 : 0
      }
      console.log('updateBody', updateBody)
      await postApiRequest.updatePost(post.id, updateBody)

      showToast({
        severity: 'success',
        message: 'Cập nhật thành công'
      })

      onSuccess?.()
    } catch (error) {
      console.log('error', error)
      showToast({
        severity: 'error',
        message: 'Cập nhật thất bại'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Switch
      checked={currentValue}
      onChange={e => handleChange(e.target.checked)}
      disabled={loading}
    />
  )
}
