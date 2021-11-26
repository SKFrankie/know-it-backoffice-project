import { FormControl, TextField } from '@mui/material'
import React from 'react'
import '../index.css'

const Form = ({ children, ...props }) => {
  return (
    <form {...props}>
      <FormControl sx={{ width: '100%' }}>{children}</FormControl>
    </form>
  )
}

const Input = ({ sx, ...props }) => {
  return <TextField className="inputRounded" sx={{ m: 1, ...sx }} {...props} />
}
export { Input }
export default Form
