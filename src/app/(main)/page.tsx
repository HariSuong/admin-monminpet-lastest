// app/(main)/page.tsx

import DashboardCard from '@/components/home/dashboard-card'
import LatestInvoiceGrid from '@/components/home/latest-invoice-grid'
import dashboardApiRequest from '@/services/apiHome'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value || ''

  try {
    const { payload: dashboard } = await dashboardApiRequest.getDashboard(
      sessionToken
    )

    console.log('dashboard', dashboard)

    return (
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Tổng số đơn hàng */}
          <DashboardCard
            title='Tổng đơn hàng'
            value={dashboard.data.total_invoices}
          />

          {/* Tổng tiền */}
          {/* <DashboardCard
            title='Tổng doanh thu'
            value={
              dashboard.data.total_invoices.toLocaleString('vi-VN') + ' VND'
            }
          /> */}

          {/* Đơn đã thanh toán */}
          <DashboardCard
            title='Tổng số sản phẩm'
            value={dashboard.data.total_products}
          />

          {/* Đơn đã vận chuyển */}
          <DashboardCard
            title='Tổng số bài viết'
            value={dashboard.data.total_posts}
          />

          {/* Có thể thêm các thẻ khác tương tự */}
        </Grid>
        <Grid>
          <LatestInvoiceGrid latestInvoices={dashboard.data.latest_invoices} />
        </Grid>
      </Container>
    )
  } catch (error) {
    console.error('Error fetching dashboard:', error)
  }
}
