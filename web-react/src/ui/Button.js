import React from 'react'
import { Button as MuiButton } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'

const Button = ({ children, ...props }) => {
  return (
    <MuiButton style={{ textTransform: 'initial' }} {...props}>
      {children}
    </MuiButton>
  )
}
const ButtonLink = ({ label, href, children, ...props }) => {
  return (
    <MuiButton
      {...{
        key: label,
        color: 'blue',
        to: href,
        component: RouterLink,
      }}
      style={{ textTransform: 'initial' }}
      {...props}
    >
      {children}
    </MuiButton>
  )
}

export { ButtonLink }
export default Button
