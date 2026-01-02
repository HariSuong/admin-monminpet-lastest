// src/components/MenuSelect.tsx

'use client'

import { Chip, MenuItem, Select } from '@mui/material'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

interface AttributeSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  attributes?: AttributeItemType[]
}

interface AttributeItemType {
  id: number
  name: string
}

export default function AttributeSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name, attributes }: AttributeSelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Select
            {...field}
            fullWidth
            value={field.value ?? ''} // Giá trị đơn
            onChange={event => {
              const value = Number(event.target.value)
              field.onChange(value)
            }}
            renderValue={selected => {
              if (!selected) {
                return <span>Chọn loại thuộc tính</span>
              }
              const menu = attributes?.find(m => m.id === selected)

              return <Chip label={menu?.name || selected} />
            }}>
            {attributes!.map(attr => (
              <MenuItem key={attr.id} value={attr.id}>
                {attr.name}
              </MenuItem>
            ))}
          </Select>
        )
      }}
    />
  )
}
