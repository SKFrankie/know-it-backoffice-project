import { FormControl, TextField } from '@mui/material'
import React from 'react'

const Form = ({ children, ...props }) => {
  return <FormControl {...props}>{children}</FormControl>
}

const Input = ({ sx, ...props }) => {
  return <TextField sx={{ m: 1, ...sx }} {...props} />
}
export { Input }
export default Form
