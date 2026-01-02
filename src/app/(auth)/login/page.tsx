import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import React from 'react'
import AuthLogin from '@/app/(auth)/login/login-form'

const LoginPage = () => {
  return (
    <div>
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3'
          }
        }}>
        <Grid
          container
          spacing={0}
          justifyContent='center'
          sx={{ height: '100vh' }}>
          <Grid
            // item
            size={{ xs: 12, sm: 12, lg: 4, xl: 3 }}
            display='flex'
            justifyContent='center'
            alignItems='center'>
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              <Box display='flex' alignItems='center' justifyContent='center'>
                {/* <Logo /> */}
              </Box>
              <AuthLogin />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default LoginPage
