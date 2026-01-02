'use client'

import { ProductItem } from '@/schemaValidations/product.schema'
import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SuggestProductsSelectProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  productList: ProductItem[]
}

interface ProductItemType {
  id: number
  name: string
}

export default function ProductsSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name, productList }: SuggestProductsSelectProps<TFieldValues>) {
  const [products, setProducts] = useState<ProductItemType[]>([])

  // Sửa tại đây: Thêm useEffect để xử lý cập nhật state
  useEffect(() => {
    const filteredProducts = productList
      .filter((product: ProductItem) => product.show === 1)
      .map(product => ({ id: product.id, name: product.name }))

    setProducts(filteredProducts)
  }, [productList]) // Thêm dependency vào productList

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          id='tags-standard'
          options={products}
          getOptionLabel={option => option.name}
          onChange={(event, value) => {
            field.onChange(value?.id || null)
          }}
          value={products.find(product => product.id === field.value) || null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => (
            <TextField {...params} placeholder='Tìm sản phẩm...' />
          )}
        />
      )}
    />
  )
}
