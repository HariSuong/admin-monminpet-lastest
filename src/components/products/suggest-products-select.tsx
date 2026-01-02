// src/components/products/suggest-products-select.tsx

'use client'

import { Autocomplete, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'

import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SuggestProductsSelectProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  products: ProductItemType[]
}
export interface ProductItemType {
  id: number
  name: string
}

export default function SuggestProductsSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name, products }: SuggestProductsSelectProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          id='tags-standard'
          multiple
          options={products}
          getOptionLabel={option => option.name}
          value={products.filter(p => field.value?.includes(p.id))} // Map IDs to objects
          onChange={(_, newValue) => {
            field.onChange(newValue.map(item => item.id)) // Save array of IDs
          }}
          // isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => (
            <TextField
              {...params}
              // label='Chọn sản phẩm gợi ý'
              placeholder='Tìm sản phẩm...'
            />
          )}
        />
      )}
    />
  )
}
