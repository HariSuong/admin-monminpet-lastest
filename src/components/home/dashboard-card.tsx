import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

interface DashboardCardProps {
  title: string
  value: string | number
}

function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card sx={{ height: '100%', boxShadow: 3 }}>
        <CardContent>
          <Typography variant='subtitle2' color='text.secondary' gutterBottom>
            {title}
          </Typography>
          <Typography variant='h5' fontWeight='bold'>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default DashboardCard
