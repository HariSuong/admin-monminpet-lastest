'use client'

import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'

import CustomToolbar from '@/components/custom-toolbar'
import { useToast } from '@/contexts/toast-context'

import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import serviceApiRequest from '@/services/apiMenu'
import { ServiceListPag } from '@/schemaValidations/services.schema'
import ToggleCell from '@/components/services/toggle-cell'

interface ServiceCrudGridProps {
  initialServices: ServiceListPag
  sessionToken: string
}

export default function ServicesList({
  initialServices,
  sessionToken
}: ServiceCrudGridProps) {
  const [rows, setRows] = useState(initialServices.data)
  const { showToast } = useToast()

  const [paginationModel, setPaginationModel] = useState({
    page: initialServices.current_page - 1,
    pageSize: initialServices.per_page
  })

  const [rowCount, setRowCount] = useState(initialServices.total)
  const [loading, setLoading] = useState(false)

  // Phân trang
  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true)
        const { payload } = await serviceApiRequest.getAllServices(
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
    if (confirm('Bạn có chắc chắn muốn xóa chuyên mục này?')) {
      setRows(prev => prev.filter(item => item.id !== id))
      // Gọi API xóa:
      try {
        const result = await serviceApiRequest.deleteMenu(id)

        showToast({
          severity: 'success',
          message: 'Xóa thành công',
          description: 'Mã giảm giá sẽ được xóa trong giây lát'
        })

        console.log('result', result)
      } catch (error) {
        const status = (error as { status: number }).status
        if (status === 400) {
          showToast({
            severity: 'error',
            message: 'Lỗi xóa chuyên mục',
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
      field: 'thumb',
      headerName: 'Ảnh đại diện',
      width: 120,
      hideable: false,

      renderCell: params => (
        <div className='relative w-16 h-16'>
          <Image
            src={params.row.thumb}
            alt={params.row.name}
            fill
            className='object-cover rounded'
            sizes='(max-width: 768px) 100vw, 50vw'
          />
        </div>
      )
    },
    {
      field: 'name',
      headerName: 'Tên chuyên mục',
      width: 200,
      hideable: true,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.name}</div>
      )
    },
    {
      field: 'hot',
      headerName: 'Chuyên mục hot',
      width: 120,
      hideable: false,
      renderCell: params => (
        <ToggleCell
          field='hot'
          service={params.row} // Truyền toàn bộ dữ liệu chuyên mục
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
          service={params.row} // Truyền toàn bộ dữ liệu chuyên mục
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'order',
      headerName: 'Thứ tự',
      width: 80,
      hideable: false,
      valueGetter: (value, row) => row.order
    },
    {
      field: 'display_type',
      headerName: 'Loại chuyên mục',
      width: 80,
      hideable: false,
      valueGetter: (value, row) => row.display_type
    },
    {
      field: 'inside_name',
      headerName: 'Chuyên mục cha',
      width: 80,
      hideable: false,
      valueGetter: (value, row) => row.inside_name
    },
    {
      field: 'faq_questions',
      headerName: 'Câu hỏi thường gặp',
      width: 200,
      hideable: true,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.faq_questions}</div>
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
            <Link href={`/services/edit/${row.id}`}>
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
          toolbar: () => <CustomToolbar href='/services/add' />
        }}
        showToolbar
        localeText={{
          noRowsLabel: 'Không có chuyên mục nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} chuyên mục`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} chuyên mục`
        }}
      />
    </Box>
  )
}
