import { Skeleton } from '@mui/material'

export default function Loading() {
  return (
    <div className='p-4'>
      <Skeleton variant='text' width={200} height={40} />
      <Skeleton
        variant='rectangular'
        width='100%'
        height={400}
        className='mt-4'
      />
      <Skeleton variant='text' width={150} height={30} className='mt-4' />
      <Skeleton
        variant='rectangular'
        width='100%'
        height={300}
        className='mt-2'
      />
      <Skeleton variant='text' width={100} height={30} className='mt-4' />
      <Skeleton
        variant='rectangular'
        width='100%'
        height={200}
        className='mt-2'
      />
    </div>
  )
}
