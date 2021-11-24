import { Box, useTheme } from '@material-ui/core'
import React from 'react'

const Home = () => {
  const theme = useTheme()
  return <Box color={theme.palette.primary.main}>Know It - Backoffice</Box>
}

export default Home
