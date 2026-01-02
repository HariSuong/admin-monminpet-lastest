'use client'

import CustomToolbar from '@/components/custom-toolbar'
import { useToast } from '@/contexts/toast-context'
import {
  AttributeItem,
  AttributeListPag
} from '@/schemaValidations/attribute.schema'
import attributeApiRequest from '@/services/apiAttributes'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

interface ProductCrudGridProps {
  initialAttributes: AttributeListPag
  sessionToken: string
}

export default function AttributeList({
  initialAttributes,
  sessionToken
}: ProductCrudGridProps) {
  const [rows, setRows] = useState<AttributeItem[]>(initialAttributes.data)
  const [paginationModel, setPaginationModel] = useState({
    page: initialAttributes.current_page - 1,
    pageSize: initialAttributes.per_page
  })

  const { showToast } = useToast()
  const [rowCount, setRowCount] = useState(initialAttributes.total)
  const [loading, setLoading] = useState(false)

  console.log('initialAttributes', initialAttributes)

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: true,
    attribute_name: true,
    product_name: true,
    name: true,
    price: true,
    image: true,
    actions: true
  })

  // Phân trang
  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true)
        const { payload } = await attributeApiRequest.getProductAttributes(
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
    if (confirm('Bạn có chắc chắn muốn xóa thuộc tính này?')) {
      setRows(prev => prev.filter(item => item.id !== id))
      // Gọi API xóa:
      try {
        const result = await attributeApiRequest.deleteAttributes(id)

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
            message: 'Lỗi xóa thuộc tính',
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
      width: 90,
      type: 'number'
    },
    {
      field: 'attribute_name',
      headerName: 'Loại thuộc tính',
      width: 200
    },
    {
      field: 'product_name',
      headerName: 'Tên sản phẩm',
      width: 200
    },

    {
      field: 'name',
      headerName: 'Tên thuộc tính',
      width: 200
    },
    {
      field: 'price',
      headerName: 'Giá thuộc tính',
      width: 150,
      type: 'number'
    },
    {
      field: 'image',
      headerName: 'Hình ảnh thuộc tính',
      width: 150,
      renderCell: params => {
        console.log('params.value', params.value)
        return params.value !== null ? (
          <Image
            src={params.value}
            alt='Product Image'
            width={50}
            height={50}
          />
        ) : null
      }
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      type: 'actions',
      width: 150,
      getActions: params => [
        <Link href={`/attributes/edit/${params.id}`} key='edit'>
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
          toolbar: () => <CustomToolbar href='/attributes/add' />
        }}
        showToolbar
        localeText={{
          noRowsLabel: 'Không có thuộc tính nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} thuộc tính`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} thuộc tính`
        }}
      />
    </Box>
  )
}
