// src/components/editor.tsx
'use client'

import dynamic from 'next/dynamic'

// Import file tiny-mce gốc của bạn và tắt SSR ngay tại đây
const Editor = dynamic(() => import('./tiny-mce'), {
  ssr: false,
  loading: () => <p>Đang tải bộ soạn thảo...</p>
})

export default Editor
