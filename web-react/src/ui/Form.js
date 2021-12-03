import {
  FormControl,
  TextField,
  Select as MUISelect,
  MenuItem,
} from '@mui/material'
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
const SelectWithItems = ({ selectValues, ...props }) => {
  return (
    <Select {...props}>
      {selectValues.map((menuItem) => (
        <MenuItem key={menuItem.id} value={menuItem.id}>
          {menuItem.id}
        </MenuItem>
      ))}
    </Select>
  )
}
export { Input, Select, SelectWithItems }
export default Form
