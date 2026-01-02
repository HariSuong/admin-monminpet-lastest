'use client'

import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'

import CustomToolbar from '@/components/custom-toolbar'
import { useToast } from '@/contexts/toast-context'
import { CouponListPag } from '@/schemaValidations/coupon.schema'
import couponApiRequest from '@/services/apiCoupon'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import ToggleCell from '@/components/coupons/toggle-cell'

interface CouponCrudGridProps {
  initialCoupons: CouponListPag
  sessionToken: string
}

export default function CouponList({
  initialCoupons,
  sessionToken
}: CouponCrudGridProps) {
  const [rows, setRows] = useState(initialCoupons.data)
  const { showToast } = useToast()

  const [paginationModel, setPaginationModel] = useState({
    page: initialCoupons.current_page - 1,
    pageSize: initialCoupons.per_page
  })

  const [rowCount, setRowCount] = useState(initialCoupons.total)
  const [loading, setLoading] = useState(false)

  const handleDeleteClick = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      setRows(prev => prev.filter(item => item.id !== id))
      // Gọi API xóa:
      try {
        const result = await couponApiRequest.deleteCoupons(id)
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
            message: 'Lỗi xóa mã giảm giá',
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
        const { payload } = await couponApiRequest.getCoupons(
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
      field: 'code',
      headerName: 'Mã giảm giá',
      width: 150,
      hideable: false,
      valueGetter: (value, row) => row.code
    },
    {
      field: 'discount',
      headerName: 'Giá trị',
      width: 150,
      hideable: true,
      valueGetter: (value, row) => row.discount.toLocaleString('vi-VN')
    },
    {
      field: 'type',
      headerName: 'Loại',
      width: 150,
      hideable: true,
      valueGetter: (value, row) => (row.type === 1 ? 'VND' : '%')
    },
    {
      field: 'exp_time',
      headerName: 'Thời gian hết hạn',
      width: 150,
      hideable: true,
      valueFormatter: (value, row) => {
        console.log('row', row.exp_time)
        return new Date(row.exp_time).toLocaleDateString('vi-VN')
      }
    },
    {
      field: 'active',
      headerName: 'Trạng thái',
      width: 150,
      hideable: true,
      renderCell: params => (
        <ToggleCell
          field='active'
          coupon={params.row}
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'count',
      headerName: 'Số lượng',
      width: 150,
      hideable: true,
      valueGetter: (value, row) => row.count
    },
    {
      field: 'reached_price',
      headerName: 'Giá trị đơn hàng tối thiểu',
      width: 200,
      hideable: true,
      valueGetter: (value, row) =>
        row.reached_price.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND'
        })
    },

    {
      field: 'created_at',
      headerName: 'Ngày tạo',
      width: 150,
      hideable: true,
      valueFormatter: (value, row) =>
        new Date(row.created_at).toLocaleDateString('vi-VN')
    },

    /**  {
            "id": 6,
            "code": "MONMIN25",
            "discount": 25000,
            "type": 1,
            "exp_time": "2025-07-31 00:00",
            "active": 1,
            "count": 20,
            "reached_price": 498000,
            "users": "1,20",
            "created_at": "2025-04-21T15:13:07.000000Z",
            "user_list": [
                {
                    "id": 1,
                    "full_name": "Nguyễn Xuân Giàu"
                },
                {
                    "id": 20,
                    "full_name": "Mini"
                }
            ]
        } */
    {
      field: 'user_list',
      headerName: 'Người dùng',
      width: 200,
      hideable: true,
      valueGetter: (value, row) => {
        if (row.user_list.length === 0) return 'Tất cả người dùng'
        const userList = (
          row.user_list as { id: number; full_name: string }[]
        ).map(user => user.full_name)
        return userList.join(', ')
      }
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
            <Link href={`/coupons/edit/${row.id}`}>
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
          toolbar: () => <CustomToolbar href='/coupons/add' />
        }}
        showToolbar
        localeText={{
          noRowsLabel: 'Không có mã giảm giá nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} mã giảm giá`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} mã giảm giá`
        }}
      />
    </Box>
  )
}
