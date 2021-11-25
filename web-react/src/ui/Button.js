import React from 'react'
import { Button as MuiButton } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Button = ({ children, ...props }) => {
  return (
    <MuiButton style={{ textTransform: 'initial' }} {...props}>
      {children}
    </MuiButton>
  )
}
const ButtonLink = ({ href, children, ...props }) => {
  return (
    <MuiButton
      component={RouterLink}
      to={href}
      style={{ textTransform: 'initial' }}
      {...props}
    >
      {children}
    </MuiButton>
  )
}

export { ButtonLink }
export default Button
