'use client'
import { createTheme } from '@mui/material/styles'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap'
})

// const theme = createTheme({
//   // colorSchemes: { light: true, dark: true },

//   cssVariables: {
//     colorSchemeSelector: 'class'
//   },
//   typography: {
//     fontFamily: roboto.style.fontFamily
//   },
//   components: {
//     MuiAlert: {
//       styleOverrides: {
//         root: {
//           variants: [
//             {
//               props: { severity: 'info' },
//               style: {
//                 backgroundColor: '#60a5fa'
//               }
//             }
//           ]
//         }
//       }
//     }
//   },
//   palette: {
//     mode: 'light' // hoặc 'light' tùy bạn muốn mặc định
//   }
// })

// export default theme

const theme = createTheme({
  palette: {
    mode: 'light' // ✅ Luôn là sáng
  },
  typography: {
    fontFamily: roboto.style.fontFamily
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa'
              }
            }
          ]
        }
      }
    }
  }
})
export default theme
//
