'use client'

import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'

import CustomToolbar from '@/components/custom-toolbar'
import { useToast } from '@/contexts/toast-context'

import ToggleCell from '@/components/posts/toggle-cell'
import { PostListPag } from '@/schemaValidations/post.schema'
import postApiRequest from '@/services/apiPosts'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface PostCrudGridProps {
  initialPosts: PostListPag
  sessionToken: string
}

export default function PostList({
  initialPosts,
  sessionToken
}: PostCrudGridProps) {
  const [rows, setRows] = useState(initialPosts.data)
  const { showToast } = useToast()

  const [paginationModel, setPaginationModel] = useState({
    page: initialPosts.current_page - 1,
    pageSize: initialPosts.per_page
  })

  const [rowCount, setRowCount] = useState(initialPosts.total)
  const [loading, setLoading] = useState(false)

  // Phân trang
  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true)
        const { payload } = await postApiRequest.getPosts(
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

  const handleDeleteClick = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setRows(prev => prev.filter(item => item.id !== id))
      // Gọi API xóa:
      try {
        const result = await postApiRequest.deletePost(id)

        showToast({
          severity: 'success',
          message: 'Xóa thành công',
          description: 'Bài viết sẽ được xóa trong giây lát'
        })

        console.log('result', result)
      } catch (error) {
        const status = (error as { status: number }).status
        if (status === 400) {
          showToast({
            severity: 'error',
            message: 'Lỗi xóa bài viết',
            description: 'Vui lòng báo lại quản trị viên để biết thêm thông tin'
          })
        }
      }
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      hideable: false,
      valueGetter: (value, row) => row.id
    },
    {
      field: 'title',
      headerName: 'Tên bài viết',
      width: 200,
      hideable: true,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.title}</div>
      )
    },
    {
      field: 'hot',
      headerName: 'Bài viết hot',
      width: 120,
      hideable: false,
      renderCell: params => (
        <ToggleCell
          field='hot'
          post={params.row} // Truyền toàn bộ dữ liệu bài viết
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'show',
      hideable: false,
      headerName: 'Hiển thị',
      width: 100,
      renderCell: params => (
        <ToggleCell
          field='show'
          post={params.row} // Truyền toàn bộ dữ liệu bài viết
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'user',
      headerName: 'Người đăng',
      width: 80,
      hideable: false,
      valueGetter: (value, row) => row.id
    },
    {
      field: 'thumb',
      headerName: 'Ảnh',
      width: 120,
      hideable: false,

      renderCell: params => (
        <div className='relative w-16 h-16'>
          <Image
            src={params.row.thumb}
            alt={params.row.name || 'Hình ảnh bài viết'}
            fill
            className='object-cover rounded'
            sizes='(max-width: 768px) 100vw, 50vw'
          />
        </div>
      )
    },

    {
      field: 'keywords',
      headerName: 'Từ khóa',
      width: 200,
      hideable: true,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.keywords}</div>
      )
    },
    {
      field: 'menu_name',
      headerName: 'Chuyên mục',
      width: 200,
      hideable: true,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.menu_name}</div>
      )
    },
    {
      field: 'created_at',
      headerName: 'Ngày tạo',
      width: 150,
      hideable: true,
      valueFormatter: (value, row) =>
        new Date(row.created_at).toLocaleDateString('vi-VN')
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
            <Link href={`/posts/edit/${row.id}`}>
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
          toolbar: () => <CustomToolbar href='/posts/add' />
        }}
        showToolbar
        localeText={{
          noRowsLabel: 'Không có bài viết nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} bài viết`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} bài viết`
        }}
      />
    </Box>
  )
}
