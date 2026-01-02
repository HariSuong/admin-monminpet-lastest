'use client'

import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { InvoiceDashboardItemType } from '@/schemaValidations/dashboard.schema'

interface LatestInvoiceGridProps {
  latestInvoices: InvoiceDashboardItemType[]
}

export default function LatestInvoiceGrid({
  latestInvoices
}: LatestInvoiceGridProps) {
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'name',
      headerName: 'Tên',
      width: 200,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.name}</div>
      )
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 180
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
      field: 'paid',
      headerName: 'Đã thanh toán',
      width: 120,
      renderCell: params => <span>{params.row.paid ? '✅' : '❌'}</span>
    },
    {
      field: 'delivered',
      headerName: 'Đã giao',
      width: 120,
      renderCell: params => <span>{params.row.delivered ? '✅' : '❌'}</span>
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
      valueFormatter: (value, row) =>
        new Date(row.created_at).toLocaleDateString('vi-VN')
    }
  ]

  return (
    <Box sx={{ height: 'auto', width: '100%', marginTop: '50px' }}>
      <DataGrid
        rows={latestInvoices}
        columns={columns}
        hideFooterPagination={true}
        hideFooter={true}
        hideFooterSelectedRowCount={true}
      />
    </Box>
  )
}
