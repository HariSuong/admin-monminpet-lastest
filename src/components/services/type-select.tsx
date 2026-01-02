// src/components/MenuSelect.tsx

'use client'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

interface TypeSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  types: TypesSelect[]
}

export interface TypesSelect {
  id: number
  name: string
}

export default function TypeSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name, types }: TypeSelectProps<TFieldValues>) {
  // const [types, setMenus] = useState<MenuItemType[]>([])
  console.log('types', types)
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Autocomplete
            id='tags-standard'
            options={types}
            getOptionLabel={option => option.name || ''}
            onChange={(event, value) => {
              field.onChange(value?.id || null)
            }}
            value={types.find(type => type.id === field.value) || null} // khớp giá trị id với objec
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <TextField {...params} placeholder='Tìm loại chuyên mục...' />
            )}
          />
        )
      }}
    />
  )
}
