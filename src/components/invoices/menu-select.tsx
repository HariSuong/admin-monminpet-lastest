// src/components/MenuSelect.tsx

'use client'

import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Select, MenuItem, Chip, Box, CircularProgress } from '@mui/material'
import menuApiRequest from '@/services/apiMenu'
import { Control, FieldValues, FieldPath } from 'react-hook-form'

interface MenuSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
}

interface MenuItemType {
  id: number
  name: string
}

export default function MenuSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name }: MenuSelectProps<TFieldValues>) {
  const [menus, setMenus] = useState<MenuItemType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await menuApiRequest.getMenusClient(2, 100)
        console.log(res?.payload.data)
        setMenus(res.payload.data)
      } catch (error) {
        console.error('Error fetching menus:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMenus()
  }, [])

  if (loading) {
    return <CircularProgress />
  }

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
                return <span>Chọn các chuyên mục</span>
              }

              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).map(id => {
                    const menu = menus.find(m => m.id === id)
                    return <Chip key={id} label={menu?.name || id} />
                  })}
                </Box>
              )
            }}>
            {menus.map(menu => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.name}
              </MenuItem>
            ))}
          </Select>
        )
      }}
    />
  )
}
