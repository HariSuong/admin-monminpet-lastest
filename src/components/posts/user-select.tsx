'use client'

import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, TextField, CircularProgress } from '@mui/material'

import { Control, FieldValues, FieldPath } from 'react-hook-form'
import userApiRequest from '@/services/apiUsers'
import { UserItem } from '@/schemaValidations/user.schema'

interface SuggestUsersSelectProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
}
interface UserItemType {
  id: number
  name: string | null
}

export default function UsersSelect<
  TFieldValues extends FieldValues = FieldValues
>({ control, name }: SuggestUsersSelectProps<TFieldValues>) {
  const [users, setUsers] = useState<UserItemType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await userApiRequest.getUsers()
        // Lọc dữ liệu chỉ lấy id và name lưu vào user
        const filteredData = res?.payload.data.map((item: UserItem) => ({
          id: item.id,
          name: item.full_name
        }))
        setUsers(filteredData)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return <CircularProgress />
  }
  // console.log('users', users)
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        console.log('field', field)
        return (
          <Autocomplete
            id='tags-standard'
            options={users}
            getOptionLabel={option => option.name || ''}
            onChange={(event, value) => {
              field.onChange(value?.id || null)
            }}
            value={users.find(product => product.id === field.value) || null} // khớp giá trị id với objec
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <TextField
                {...params}
                // label='Chọn sản phẩm gợi ý'
                placeholder='Tìm tên người dùng...'
              />
            )}
          />
        )
      }}
    />
  )
}
