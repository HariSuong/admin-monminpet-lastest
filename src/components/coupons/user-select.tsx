'use client'

import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'

import { UserItem } from '@/schemaValidations/user.schema'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SuggestUsersSelectProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  userList: UserItem[]
}
interface UserItemType {
  id: number
  name: string | null
}

export default function SuggestUsersSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name, userList }: SuggestUsersSelectProps<TFieldValues>) {
  const [users, setUsers] = useState<UserItemType[]>([])
  console.log('userList', userList)

  // Sửa tại đây: Thêm useEffect để xử lý cập nhật state
  useEffect(() => {
    const filteredUsers = userList.map(user => ({
      id: user.id,
      name: user.full_name
    }))

    setUsers(filteredUsers)
  }, [userList]) // Thêm dependency vào userList

  // if (loading) {
  //   return <CircularProgress />
  // }
  console.log('users', users)
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          id='tags-standard'
          multiple
          options={users}
          getOptionLabel={option => option.name || ''}
          value={users.filter(p => field.value?.includes(p.id))} // Map IDs to objects
          onChange={(_, newValue) => {
            field.onChange(newValue.map(item => item.id)) // Save array of IDs
          }}
          // isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => (
            <TextField
              {...params}
              // label='Chọn người dùng gợi ý'
              placeholder='Tìm người dùng...'
            />
          )}
        />
      )}
    />
  )
}
