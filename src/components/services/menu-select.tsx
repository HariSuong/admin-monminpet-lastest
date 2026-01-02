// src/components/MenuSelect.tsx

'use client'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

interface MenuSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  menus: MenuItemType[]
}

export interface MenuItemType {
  id: number
  name: string
}

export default function MenuSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name, menus }: MenuSelectProps<TFieldValues>) {
  // const [menus, setMenus] = useState<MenuItemType[]>([])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Autocomplete
            id='tags-standard'
            options={menus}
            getOptionLabel={option => option.name || ''}
            onChange={(event, value) => {
              field.onChange(value?.id || null)
            }}
            value={menus.find(menu => menu.id === field.value) || null} // khớp giá trị id với objec
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <TextField {...params} placeholder='Tìm chuyên mục...' />
            )}
          />
        )
      }}
    />
  )
}
