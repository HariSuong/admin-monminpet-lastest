// src/components/products/multi-image-upload-box.tsx

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import {
  CloudUpload as CloudUploadIcon,
  Delete,
  Visibility
} from '@mui/icons-material'
import { useRef, useState } from 'react'
import Image from 'next/image'
import productApiRequest from '@/services/apiProducts'
import { useToast } from '@/contexts/toast-context'
import { IconButton } from '@mui/material'

interface Props {
  label?: string
  defaultImages?: string[] // mảng url ảnh đã có sẵn
  onImagesUploaded: (urls: string) => void // callback gán vào form (dạng string)
}

const MultiImageUploadBox: React.FC<Props> = ({
  label,
  defaultImages = [],
  onImagesUploaded
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { showToast } = useToast()
  const [previews, setPreviews] = useState<string[]>(defaultImages)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoading(true)

    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('image[]', file, file.name)
    })

    try {
      const response = await productApiRequest.uploadTempImage(formData)
      const urlsString = response.payload

      const newImages = urlsString.split(',')

      setPreviews(prev => [...prev, ...newImages])

      console.log(
        '[...previews, ...newImages].toString()',
        [...previews, ...newImages].toString()
      )

      onImagesUploaded([...previews, ...newImages].toString()) // gửi nguyên string
    } catch {
      showToast({
        severity: 'error',
        message: 'Tải ảnh thất bại'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewImage = (src: string) => {
    setPreviewImage(src)
  }

  const handleRemoveImage = (src: string) => {
    const updated = previews.filter(url => url !== src)
    console.log('updated', updated.join(','))
    setPreviews(updated)
    onImagesUploaded(updated.join(','))
  }

  return (
    <>
      <Box display='flex' flexDirection='column' gap={1}>
        <Typography fontWeight='bold'>
          {label || 'Ảnh chi tiết sản phẩm (nhiều ảnh)'}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {/* {previews.length > 0 ? (
          previews.map((src, idx) => (
            <Image
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              width={120}
              height={120}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          ))
        ) : (
          <Typography color='text.secondary'>Chưa có ảnh nào</Typography>
        )} */}
          {previews.map((src, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                borderRadius: 1,
                overflow: 'hidden'
              }}>
              <Image
                src={src}
                alt={`preview-${idx}`}
                width={120}
                height={120}
                style={{ objectFit: 'cover' }}
                onClick={() => handleViewImage(src)}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5
                }}>
                <IconButton
                  size='small'
                  onClick={() => handleViewImage(src)}
                  sx={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff' }}>
                  <Visibility fontSize='small' />
                </IconButton>

                <IconButton
                  size='small'
                  onClick={() => handleRemoveImage(src)}
                  sx={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#ff3b3b' }}>
                  <Delete fontSize='small' />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          variant='contained'
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}>
          {loading ? 'Đang tải ảnh...' : 'Tải ảnh lên'}
        </Button>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          hidden
          multiple
          onChange={handleFileChange}
        />
      </Box>
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth='md'>
        <Box p={2}>
          {previewImage && (
            <Image
              src={previewImage}
              alt='Preview'
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          )}
        </Box>
      </Dialog>
    </>
  )
}

export default MultiImageUploadBox
