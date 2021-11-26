import React from 'react'
import { Button as MuiButton } from '@mui/material'
import { NavLink as RouterLink } from 'react-router-dom'

const Button = ({ children, ...props }) => {
  return (
    <MuiButton style={{ textTransform: 'initial' }} {...props}>
      {children}
    </MuiButton>
  )
}
const ButtonLink = ({ href, children, ...props }) => {
  return (
    <Button component={RouterLink} to={href} {...props}>
      {children}
    </Button>
  )
}

const ButtonLinkUnstyled = ({ href, children, ...props }) => {
  return (
    <ButtonLink href={href} {...props}>
      {children}
    </ButtonLink>
  )
}

export { ButtonLink, ButtonLinkUnstyled }
export default Button
