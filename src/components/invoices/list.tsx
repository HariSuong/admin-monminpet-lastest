'use client'

import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'

import CustomToolbar from '@/components/custom-toolbar'
import { useToast } from '@/contexts/toast-context'

import { InvoiceListPag } from '@/schemaValidations/invoice.schema'
import invoiceApiRequest from '@/services/apiInvoices'
// import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
// import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import ToggleCell from '@/components/invoices/toggle-cell'

interface InvoiceCrudGridProps {
  initialInvoices: InvoiceListPag
  sessionToken: string
}

export default function InvoiceList({
  initialInvoices,
  sessionToken
}: InvoiceCrudGridProps) {
  const [rows, setRows] = useState(initialInvoices.data)
  const { showToast } = useToast()
  console.log('initialInvoices', initialInvoices)
  const [paginationModel, setPaginationModel] = useState({
    page: initialInvoices.current_page - 1,
    pageSize: initialInvoices.per_page
  })

  const [rowCount, setRowCount] = useState(initialInvoices.total)
  const [loading, setLoading] = useState(false)

  // Phân trang
  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true)
        const { payload } = await invoiceApiRequest.getInvoices(
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
      field: 'name',
      headerName: 'Tên',
      width: 200,
      hideable: true,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.name}</div>
      )
    },
    {
      field: 'paid',
      headerName: 'Đã thanh toán',
      width: 120,
      hideable: false,
      renderCell: params => (
        <ToggleCell
          field='paid'
          invoice={params.row} // Truyền toàn bộ dữ liệu đơn hàng
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'delivered',
      hideable: false,
      headerName: 'Đã vận chuyện',
      width: 100,
      renderCell: params => (
        <ToggleCell
          field='delivered'
          invoice={params.row} // Truyền toàn bộ dữ liệu đơn hàng
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 80,
      hideable: false,
      valueGetter: (value, row) => row.email
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      width: 120,
      hideable: false,
      valueGetter: (value, row) => row.address
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      width: 120,
      hideable: false,
      valueGetter: (value, row) => row.phone
    },

    {
      field: 'amount',
      headerName: 'Giá (VND)',
      hideable: false,
      width: 150,
      valueFormatter: (value, row) =>
        new Intl.NumberFormat('vi-VN').format(row.amount)
    },
    {
      field: 'discount',
      headerName: 'Giá được giảm (VND)',
      hideable: false,
      width: 150,
      valueFormatter: (value, row) =>
        new Intl.NumberFormat('vi-VN').format(row.discount)
    },
    {
      field: 'total',
      headerName: 'Tổng tiền (VND)',
      hideable: false,
      width: 150,
      valueFormatter: (value, row) =>
        new Intl.NumberFormat('vi-VN').format(row.total)
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
            <Link href={`/invoices/edit/${row.id}`}>
              <EditIcon fontSize='small' />
            </Link>
          }
          label='Sửa'
          color='inherit'
        />
        // <GridActionsCellItem
        //   key='delete'
        //   icon={<DeleteIcon fontSize='small' />}
        //   label='Xóa'
        //   // onClick={handleDeleteClick(row.id)}
        //   color='inherit'
        // />
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
          noRowsLabel: 'Không có đơn hàng nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} đơn hàng`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} đơn hàng`
        }}
      />
    </Box>
  )
}
