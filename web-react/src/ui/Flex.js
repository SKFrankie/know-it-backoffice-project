import React from 'react'
import { Box } from '@mui/material'

const Flex = ({ children, ...props }) => {
  return (
    <Box sx={{ display: 'flex' }} {...props}>
      {children}
    </Box>
  )
}

const Column = ({ children, sx, ...props }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }} {...props}>
      {children}
    </Box>
  )
}

export { Column }
export default Flex
