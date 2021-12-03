import { Typography } from '@mui/material'
import React from 'react'
import { FIELD_TYPES } from '../helpers/constants'
import { Input, SelectWithItems } from '../ui/Form'

const EditableField = ({
  editMode = false,
  column,
  setUpdatedFields,
  updatedFields = {},
  defaultValue = '',
}) => {
  switch (editMode) {
    case true && column.editable:
      switch (column.type) {
        case FIELD_TYPES.SELECT:
          return (
            <SelectWithItems
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : defaultValue || ''
              }
              onChange={(e) => {
                setUpdatedFields({
                  ...updatedFields,
                  [column.id]: e.target.value,
                })
              }}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ m: 1 }}
              selectValues={column.selectValues}
            />
          )
        default:
          return (
            <Input
              onChange={(e) => {
                setUpdatedFields({
                  ...updatedFields,
                  [column.id]: e.target.value,
                })
              }}
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : defaultValue || ''
              }
            />
          )
      }
    default:
      switch (column.type) {
        case FIELD_TYPES.DATE:
          return (
            <Typography color="textSecondary">
              {new Date(defaultValue).toLocaleString()}
            </Typography>
          )
        default:
          return <Typography color="textSecondary">{defaultValue}</Typography>
      }
  }
}

export default EditableField