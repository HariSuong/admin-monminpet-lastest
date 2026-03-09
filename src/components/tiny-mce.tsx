// src/components/tiny-mce.tsx
'use client'
import { useToast } from '@/contexts/toast-context'
import productApiRequest from '@/services/apiProducts'
import { Editor } from '@tinymce/tinymce-react'

interface TinyMCEEditorProps {
  value: string
  onChange: (content: string) => void
}

interface BlobInfo {
  blob: () => Blob
  filename: () => string
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  const { showToast } = useToast()

  const handleImageUpload = async (blobInfo: BlobInfo): Promise<string> => {
    console.log('blobInfo', blobInfo)

    try {
      const formData = new FormData()
      formData.append('image[]', blobInfo.blob(), blobInfo.filename())

      console.log('formData', formData)

      const response = await productApiRequest.uploadTempImage(formData)
      // Xử lý cả 2 trường hợp
      if (typeof response.payload === 'string') {
        return response.payload // Trả về URL trực tiếp
      } else {
        return response.payload.url // Trả về URL từ object JSON
      }
    } catch (error) {
      console.log('error', error)
      showToast({
        severity: 'error',
        message: `Upload ảnh thất bại ${error || ''}`,
        description: 'Vui lòng thử lại hoặc liên hệ quản trị viên'
      })
      throw new Error('Upload failed')
    }
  }

  return (
    <Editor
      apiKey='uj069rvi1f9gn1nri7ai3wb94qe5arw4392lrh5h4ce2yln8'
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: false,
        plugins:
          'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
        toolbar:
          'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
        images_upload_handler: handleImageUpload,
        images_file_types: 'jpg,jpeg,png,gif,webp',
        automatic_uploads: true,
        image_title: true
      }}
    />
  )
}
export default TinyMCEEditor
