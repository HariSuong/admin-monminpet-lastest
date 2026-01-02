'use client'

import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'

import CustomToolbar from '@/components/custom-toolbar'
import { useToast } from '@/contexts/toast-context'
import { ReviewListPag } from '@/schemaValidations/review.schema'
import reviewApiRequest from '@/services/apiReview'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Rating from '@mui/material/Rating'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface ReviewCrudGridProps {
  initialReviews: ReviewListPag
  sessionToken: string
}

export default function ReviewList({
  initialReviews,
  sessionToken
}: ReviewCrudGridProps) {
  const [rows, setRows] = useState(initialReviews.data)
  const { showToast } = useToast()
  console.log('initialReviews', initialReviews)
  const [paginationModel, setPaginationModel] = useState({
    page: initialReviews.current_page - 1,
    pageSize: initialReviews.per_page
  })

  const [rowCount, setRowCount] = useState(initialReviews.total)
  const [loading, setLoading] = useState(false)

  const handleDeleteClick = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      setRows(prev => prev.filter(item => item.id !== id))
      // Gọi API xóa:
      try {
        const result = await reviewApiRequest.deleteReviews(id)
        if (result.status === 200)
          showToast({
            severity: 'success',
            message: 'Xóa thành công',
            description: 'Mã giảm giá sẽ được xóa trong giây lát'
          })

        console.log('result', result.status)
      } catch (error) {
        const status = (error as { status: number }).status
        if (status === 400) {
          showToast({
            severity: 'error',
            message: 'Lỗi xóa đánh giá',
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
        const { payload } = await reviewApiRequest.getReviews(
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
      width: 80,
      hideable: false,
      valueGetter: (value, row) => row.id
    },

    {
      field: 'content',
      headerName: 'Nội dung đánh giá',
      width: 300,
      hideable: false,
      valueGetter: (value, row) => row.content
    },
    {
      field: 'product_name',
      headerName: 'Tên sản phẩm được đánh giá',
      width: 300,
      hideable: false,
      valueGetter: (value, row) => row.product_name
    },

    {
      field: 'rating',
      headerName: 'Số sao',
      width: 150,
      hideable: false,
      sortable: false,
      renderCell: params => (
        <Rating
          name='read-only'
          value={params.row.rating}
          readOnly
          precision={0.5}
          size='small'
        />
      )
    },

    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 120,
      hideable: false,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key='edit'
          icon={
            <Link href={`/reviews/edit/${row.id}`}>
              <EditIcon fontSize='small' />
            </Link>
          }
          label='Sửa'
          color='inherit'
        />,
        <GridActionsCellItem
          key='delete'
          icon={<DeleteIcon fontSize='small' />}
          label='Xóa'
          onClick={() => handleDeleteClick(Number(row.id))}
          color='inherit'
        />
      ]
    }
  ]

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        paginationMode='server'
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={loading}
        slots={{
          toolbar: () => <CustomToolbar href='' />
        }}
        showToolbar
        localeText={{
          noRowsLabel: 'Không có đánh giá nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} đánh giá`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} đánh giá`
        }}
      />
    </Box>
  )
}
