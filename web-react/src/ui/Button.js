import React from 'react'
import { Button as MuiButton, Link } from '@mui/material'
import { NavLink as RouterLink } from 'react-router-dom'

const Button = ({ children, ...props }) => {
  return (
    <MuiButton style={{ textTransform: 'initial' }} {...props}>
      {children}
    </MuiButton>
  )
}
const ButtonLink = ({
  href,
  children,
  external = false,
  activeStyle = null,
  ...props
}) => {
  if (external) {
    return (
      <Button component={Link} href={href} {...props} target="_blank">
        {children}
      </Button>
    )
  } else {
    return (
      <Button
        component={RouterLink}
        to={href}
        activeStyle={activeStyle}
        {...props}
      >
        {children}
      </Button>
    )
  }
}

const ButtonLinkUnstyled = ({ href, children, ...props }) => {
  return (
    <ButtonLink href={href} {...props}>
      {children}
    </ButtonLink>
  )
}

const CTAButton = ({ children, sx, ...props }) => {
  return (
    <MuiButton
      sx={{
        borderRadius: 3,
        width: '100%',
        p: 1,
        m: 1,
        fontSize: 'h6.fontSize',
        ...sx,
      }}
      variant="contained"
      {...props}
    >
      {children}
    </MuiButton>
  )
}

export { ButtonLink, ButtonLinkUnstyled, CTAButton }
export default Button
