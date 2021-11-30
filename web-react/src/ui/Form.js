import { FormControl, TextField, Select as MUISelect } from '@mui/material'
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

const Select = ({ sx, children, ...props }) => {
  return (
    <MUISelect className="inputRounded" sx={{ m: 1, ...sx }} {...props}>
      {children}
    </MUISelect>
  )
}

export { Input, Select }
export default Form
