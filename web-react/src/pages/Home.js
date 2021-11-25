import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import React from 'react'

const Home = () => {
  const theme = useTheme()
  return <Box color={theme.palette.primary.main}>Know It - Backoffice</Box>
}

export default Home
