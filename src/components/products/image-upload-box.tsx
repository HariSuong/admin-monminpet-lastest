// src/components/products/image-upload-box.tsx


import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { useRef, useState } from 'react'
import Image from 'next/image'
import productApiRequest from '@/services/apiProducts'
import { useToast } from '@/contexts/toast-context'

interface Props {
  label?: string
  onImageUploaded: (url: string) => void // dùng để gán vào product-form
  defaultImage?: string
}

const ImageUploadBox: React.FC<Props> = ({
  label,
  onImageUploaded,
  defaultImage
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { showToast } = useToast()
  const [preview, setPreview] = useState<string | null>(defaultImage || null)
  const [loading, setLoading] = useState(false)
  // console.log('preview', preview)
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true)
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image[]', file, file.name)

    try {
      const response = await productApiRequest.uploadTempImage(formData)
      console.log('response.payload', response)

      setPreview(response.payload)
      onImageUploaded(response.payload)
    } catch (errors) {
      console.error('Error uploading image:', errors)

       let message = 'Tải ảnh thất bại';
      // Kiểm tra nếu lỗi là do timeout
      if (errors instanceof Error && errors.message.includes('Request timeout')) {
        message = 'Hết thời gian chờ, có thể do mạng không ổn định.';
      }
      showToast({
        severity: 'error',
        message,
        description: 'Vui lòng thử lại hoặc liên hệ quản trị viên'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' gap={1}>
      <Typography fontWeight='bold'>
        {label || 'Hình ảnh mặt trước (512x600px)'}
      </Typography>
      <Box
        sx={{
          width: 400,
          height: 550,
          backgroundColor: '#eee',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc'
        }}>
        {preview ? (
          <Image src={preview} alt='Preview' width={400} height={550} />
        ) : (
          <Typography color='text.secondary'>512 × 600</Typography>
        )}
      </Box>

      <Button
        variant='contained'
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        // loading={loading}
        // disabled={loading}
      >
        {loading ? 'Đang tải ảnh...' : 'Tải ảnh lên'}
      </Button>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        hidden
        onChange={handleFileChange}
      />
    </Box>
  )
}

export default ImageUploadBox
