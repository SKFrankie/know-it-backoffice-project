import { Autocomplete, TextField, Typography, Box } from '@mui/material'
import React from 'react'
import { FIELD_TYPES } from '../helpers/constants'
import { Input, SelectWithItems } from '../ui/Form'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

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
            <Box textAlign="center">
              {(defaultValue || updatedFields[column.id]) && (
                <img
                  style={{ maxHeight: '10vh', maxWidth: '10vw' }}
                  src={
                    column.id in updatedFields
                      ? updatedFields[column.id]
                      : defaultValue || ''
                  }
                  alt={column.label}
                  {...props}
                />
              )}
              <WidgetLoader />
              <Widget
                sources={['local', 'url']}
                resourceType={'image'}
                cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
                uploadPreset={process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET} // check that an upload preset exists and check mode is signed or unisgned
                buttonText={`Upload ${column.label}`} // default 'Upload Files'
                style={{
                  color: 'white',
                  border: 'none',
                  width: '120px',
                  borderRadius: '4px',
                  height: '25px',
                  alignSelf: 'center',
                  margin: '10px',
                  cursor: 'pointer',
                  backgroundColor: '#007EA7',
                }}
                folder={column.label}
                onSuccess={(result) => {
                  console.log('res', result)
                  doUpdate(column.id, result.info.url)
                }} // add success callback -> returns result
                onFailure={(response) => {
                  console.log('error', response.error)
                }} // add failure callback -> returns 'response.error' + 'response.result'
                logging={false} // logs will be provided for success and failure messages,
              />
            </Box>
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
            <img
              style={{ maxHeight: '10vh', maxWidth: '10vw' }}
              src={defaultValue}
              alt={column.label}
              {...props}
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
