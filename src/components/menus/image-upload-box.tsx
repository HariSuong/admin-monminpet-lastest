import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { useToast } from '@/contexts/toast-context'
import menuApiRequest from '@/services/apiMenu'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import Image from 'next/image'
import { useRef, useState } from 'react'

interface Props {
  label?: string
  onImageUploaded: (url: string) => void // dùng để gán vào post-form
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true)
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image[]', file, file.name)

    try {
      const response = await menuApiRequest.uploadTempImage(formData)
      console.log('response.payload', response.payload)

      setPreview(response.payload)
      onImageUploaded(response.payload)
    } catch {
      showToast({
        severity: 'error',
        message: 'Tải ảnh thất bại',
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
