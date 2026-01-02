// src/components/products/list.tsx

'use client'
import { ProductItem, ProductListPag } from '@/schemaValidations/product.schema'
import productApiRequest from '@/services/apiProducts'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import EditIcon from '@mui/icons-material/Edit'

import Box from '@mui/material/Box'
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { useToast } from '@/contexts/toast-context'
import CustomToolbar from '@/components/custom-toolbar'
import ToggleCell from '@/components/products/toggle-cell'

interface ProductCrudGridProps {
  initialProducts: ProductListPag
  sessionToken: string
}

export default function ProductList({
  initialProducts,
  sessionToken
}: ProductCrudGridProps) {
  // console.log('initialProducts', initialProducts)
  const [rows, setRows] = React.useState<ProductItem[]>(initialProducts.data)
  const { showToast } = useToast()
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    id: true,
    thumb: true,
    name: true,
    price: true,
    hot: true,
    show: true,
    actions: true,
    // Các cột khác mặc định ẩn
    point_change: true,
    price_old: false,
    gift: false,
    priority: false,
    stock: false,
    classify: false,
    tags: false,
    created_at: false
  })

  const [paginationModel, setPaginationModel] = React.useState({
    page: initialProducts.current_page - 1,
    pageSize: initialProducts.per_page
  })

  const [rowCount, setRowCount] = React.useState(initialProducts.total)
  const [loading, setLoading] = React.useState(false)

  const handleDeleteClick = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setRows(prev => prev.filter(item => item.id !== id))
      // Gọi API xóa:
      try {
        const result = await productApiRequest.deleteProduct(id)

        showToast({
          severity: 'success',
          message: 'Xóa thành công',
          description: 'Sản phẩm sẽ được xóa trong giây lát'
        })

        console.log('result', result)
      } catch (error) {
        const status = (error as { status: number }).status
        if (status === 400) {
          showToast({
            severity: 'error',
            message: 'Lỗi xóa sản phẩm',
            description: 'Vui lòng báo lại quản trị viên để biết thêm thông tin'
          })
        }
      }
    }
  }

  // Phân trang
  const fetchData = React.useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true)
        const { payload } = await productApiRequest.getProducts(
          sessionToken,
          page + 1, // Convert từ base 0 sang base 1
          pageSize
        )

        setRows(payload.data)
        setRowCount(payload.total)
      } catch (error) {
        console.error('Fetch products error:', error)
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

  React.useEffect(() => {
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
      field: 'thumb',
      headerName: 'Ảnh',
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
      headerName: 'Tên sản phẩm',
      width: 300,
      hideable: false,
      valueGetter: (value, row) => row.name
    },
    {
      field: 'price',
      headerName: 'Giá (VND)',
      hideable: false,
      width: 150,
      valueFormatter: (value, row) =>
        new Intl.NumberFormat('vi-VN').format(row.price)
    },
    {
      field: 'price_old',
      headerName: 'Giá cũ (VND)',
      width: 150,
      hideable: true,
      valueFormatter: (value, row) =>
        row.price_old
          ? new Intl.NumberFormat('vi-VN').format(row.price_old)
          : '-'
    },
    {
      field: 'hot',
      headerName: 'Sản phẩm hot',
      width: 120,
      hideable: false,
      renderCell: params => (
        <ToggleCell
          field='hot'
          product={params.row} // Truyền toàn bộ dữ liệu bài viết
          onSuccess={() =>
            fetchData(paginationModel.page, paginationModel.pageSize)
          }
        />
      )
    },
    {
      field: 'gift',
      headerName: 'Quà tặng',
      width: 120,
      hideable: true,
      renderCell: params => (
        <ToggleCell
          field='gift'
          product={params.row} // Truyền toàn bộ dữ liệu bài viết
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
      renderCell: params => {
        return (
          <ToggleCell
            field='show'
            product={params.row} // Truyền toàn bộ dữ liệu bài viết
            onSuccess={() =>
              fetchData(paginationModel.page, paginationModel.pageSize)
            }
          />
        )
      }
    },
    {
      field: 'priority',
      headerName: 'Ưu tiên',
      width: 100,
      hideable: true,
      valueGetter: (value, row) => row.priority
    },
    {
      field: 'point_change',
      headerName: 'Điểm đổi thưởng',
      width: 100,
      hideable: true,
      valueGetter: (value, row) => row.point_change
    },
    {
      field: 'stock',
      headerName: 'Tồn kho',
      width: 120,
      hideable: true,
      valueFormatter: (value, row) => row.stock ?? 'Không giới hạn'
    },
    {
      field: 'menu_name',
      headerName: 'Chuyên mục cha',
      width: 120,
      hideable: true,
      valueGetter: (value, row) => row.menu_name
    },
    {
      field: 'classify',
      headerName: 'Phân loại',
      width: 150,
      hideable: true,
      valueFormatter: (value, row) => row.classify || 'Không phân loại'
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 200,
      hideable: true,
      renderCell: params => (
        <div className='line-clamp-2'>{params.row.tags}</div>
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
            <Link href={`/products/edit/${row.id}`}>
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
          onClick={() => handleDeleteClick(row.id)}
          color='inherit'
        />
      ]
    }
  ]

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        paginationMode='server'
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel =>
          setColumnVisibilityModel(newModel as typeof columnVisibilityModel)
        }
        slots={{
          toolbar: () => <CustomToolbar href='/products/add' />
        }}
        showToolbar
        localeText={{
          noRowsLabel: 'Không có sản phẩm nào',
          toolbarColumns: 'Hiển thị cột', // Thay đổi label cho nút hiển thị cột
          toolbarFilters: 'Bộ lọc',
          toolbarDensity: 'Độ dày',
          toolbarExport: 'Xuất file',
          footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()} sản phẩm`,
          paginationDisplayedRows: ({ from, to, count }) =>
            `${from}-${to} trong ${count} sản phẩm`
        }}
      />
    </Box>
  )
}
