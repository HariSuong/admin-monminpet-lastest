'use client'

import CustomToolbar from '@/components/custom-toolbar'
import ToggleCell from '@/components/faq/toggle-cell'
import { useToast } from '@/contexts/toast-context'
import { FaqItem, FaqListPag } from '@/schemaValidations/faq.schema'
import faqApiRequest from '@/services/apiFaq'

import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface FaqCrudGridProps {
  initialFaqs: FaqListPag
  sessionToken: string
}

export default function FaqList({
  initialFaqs,
  sessionToken
}: FaqCrudGridProps) {
  const [rows, setRows] = useState<FaqItem[]>(initialFaqs.data)
  const [paginationModel, setPaginationModel] = useState({
    page: initialFaqs.current_page - 1,
    pageSize: initialFaqs.per_page
  })

  const { showToast } = useToast()
  const [rowCount, setRowCount] = useState(initialFaqs.total)
  const [loading, setLoading] = useState(false)

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: true,
    question: true,
    answer: true,
    sort: true,
    show: true,
    actions: true
  })

  const handleDeleteClick = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa faq này?')) {
      setRows(prev => prev.filter(item => item.id !== id))
      // Gọi API xóa:
      try {
        const result = await faqApiRequest.deleteFaqs(id)

        showToast({
          severity: 'success',
          message: 'Xóa thành công',
          description: 'Faq sẽ được xóa trong giây lát'
        })

        console.log('result', result)
      } catch (error) {
        const status = (error as { status: number }).status
        if (status === 400) {
          showToast({
            severity: 'error',
            message: 'Lỗi xóa faq',
            description: 'Vui lòng báo lại quản trị viên để biết thêm thông tin'
          })
        }
      }
    }
  }

  // Phân trang
  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true)
        const { payload } = await faqApiRequest.getFaqs(
          sessionToken,
          page + 1, // Convert từ base 0 sang base 1
          pageSize
        )

        setRows(payload.data)
        setRowCount(payload.total)
      } catch (error) {
        console.error('Fetch users error:', error)
        showToast({
          severity: 'error',
          message: 'Lỗi tải dữ liệu',
          description: 'Vui lòng thử lại sau'
        })
      } finally {
        setLoading(false)
      }
    },
    [sessionToken, showToast]
  )

  useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize)
  }, [paginationModel, fetchData])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      type: 'number'
    },
    {
      field: 'question',
      headerName: 'Câu hỏi',
      width: 200
    },
    {
      field: 'answer',
      headerName: 'Câu trả lời',
      width: 200
    },
    {
      field: 'sort',
      headerName: 'Thứ tự',
      type: 'number',
      width: 150
    },
    {
      field: 'show',
      hideable: false,
      headerName: 'Hiển thị',
      width: 100,
      renderCell: params => (
        <ToggleCell
          field='show'
          faq={params.row} // Truyền toàn bộ dữ liệu bài viết
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      type: 'actions',
      width: 150,
      getActions: params => [
        <Link href={`/faqs/edit/${params.id}`} key='edit'>
          <GridActionsCellItem icon={<EditIcon />} label='Chỉnh sửa' />
        </Link>,
        <GridActionsCellItem
          key='delete'
          icon={<DeleteIcon />}
          label='Xóa'
          onClick={() => handleDeleteClick(Number(params.id))}
        />
      ]
    }
  ]

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        paginationMode='server'
        columnVisibilityModel={columnVisibilityModel}
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={loading}
        onColumnVisibilityModelChange={newModel =>
          setColumnVisibilityModel(newModel as typeof columnVisibilityModel)
        }
        slots={{
          toolbar: () => <CustomToolbar href='/faqs/add' />
        }}
        showToolbar
        localeText={{
          noRowsLabel: 'Không có faq nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} faq`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} faq`
        }}
      />
    </Box>
  )
}
