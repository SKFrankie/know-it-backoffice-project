import { Autocomplete, TextField, Typography } from '@mui/material'
import React from 'react'
import { FIELD_TYPES } from '../helpers/constants'
import { Input, SelectWithItems } from '../ui/Form'
import EditablePicture from '../components/EditablePicture'

const EditableField = ({
  editMode = false,
  column,
  setUpdatedFields,
  updatedFields = {},
  defaultValue = null,
  ...props
}) => {
  const doUpdate = (field, value) => {
    setUpdatedFields({ ...updatedFields, [field]: value })
  }
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
                doUpdate(column.id, e.target.value)
              }}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ m: 1 }}
              selectValues={column.selectValues}
              {...props}
            />
          )
        case FIELD_TYPES.ARRAY:
          return (
            <Autocomplete
              multiple
              id={column.id}
              options={[]}
              freeSolo
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : defaultValue || []
              }
              onChange={(e, values) => {
                doUpdate(column.id, values)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={column.label}
                  placeholder="Add new"
                />
              )}
              {...props}
            />
          )
        case FIELD_TYPES.PICTURE:
          return (
            <EditablePicture
              column={column}
              defaultValue={defaultValue}
              doUpdate={doUpdate}
              updatedFields={updatedFields}
              editMode={editMode}
            />
          )
        case FIELD_TYPES.NUMBER:
          return (
            <Input
              type="number"
              onChange={(e) => {
                doUpdate(column.id, parseInt(e.target.value))
              }}
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : defaultValue || ''
              }
              label={column.label}
              {...props}
            />
          )

        default:
          return (
            <Input
              onChange={(e) => {
                doUpdate(column.id, e.target.value)
              }}
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : defaultValue || ''
              }
              label={column.label}
              {...props}
            />
          )
      }
    default:
      switch (column.type) {
        case FIELD_TYPES.DATE:
          return (
            <Typography color="textSecondary" {...props}>
              {new Date(defaultValue).toLocaleString()}
            </Typography>
          )
        case FIELD_TYPES.ARRAY:
          return (
            <Autocomplete
              multiple
              id={column.id}
              options={[]}
              freeSolo
              disabled
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : defaultValue || []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={column.label}
                />
              )}
              {...props}
            />
          )
        case FIELD_TYPES.PICTURE:
          return (
            <EditablePicture
              column={column}
              defaultValue={defaultValue}
              doUpdate={doUpdate}
              updatedFields={updatedFields}
              editMode={editMode}
            />
          )
        default:
          return (
            <Typography {...props} color="textSecondary">
              {defaultValue}
            </Typography>
          )
      }
  }
}

export default EditableField
