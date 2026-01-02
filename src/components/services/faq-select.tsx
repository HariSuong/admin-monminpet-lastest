// src/components/FaqSelect.tsx

'use client'

import { Box, Chip, MenuItem, Select } from '@mui/material'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

interface FaqSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  faqs: FaqItemType[]
}

export interface FaqItemType {
  id: number
  name: string
}

export default function FaqSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name, faqs }: FaqSelectProps<TFieldValues>) {
  console.log('faqs', faqs)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Select
            {...field}
            multiple
            fullWidth
            value={field.value || []}
            onChange={event => {
              const selectedIds = event.target.value as number[]
              field.onChange(selectedIds)
            }}
            renderValue={selected => {
              if ((selected as number[]).length === 0) {
                return <span>Chọn các câu hỏi thuộc chuyên mục</span>
              }

              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).map(id => {
                    const faq = faqs.find(m => m.id === id)
                    return <Chip key={id} label={faq?.name || id} />
                  })}
                </Box>
              )
            }}>
            {faqs.map(faq => (
              <MenuItem key={faq.id} value={faq.id}>
                {faq.name}
              </MenuItem>
            ))}
          </Select>
        )
      }}
    />
  )
}
