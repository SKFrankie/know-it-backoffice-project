import { Autocomplete, TextField, Typography, Link, Box } from '@mui/material'
import React, { useState } from 'react'
import { FIELD_TYPES } from '../helpers/constants'
import dateToString from '../helpers/dateToString'
import { Input, SelectWithItems } from '../ui/Form'
import EditablePicture from './EditablePicture'
import ToggleAvatarArray from './ToggleAvatarArray'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const EditableField = ({
  editMode = false,
  column,
  setUpdatedFields,
  updatedFields = {},
  defaultValue = null,
  ...props
}) => {
  const [openInputMultiline, setOpenInputMultiline] = useState(false)
  const multilineValue =
    column.id in updatedFields ? updatedFields[column.id] : defaultValue || ''
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
              canZoom={true}
            />
          )
        case FIELD_TYPES.NUMBER:
          return (
            <Input
              type="number"
              onChange={(e) => {
                doUpdate(column.id, parseInt(e.target.value || '0'))
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
        case FIELD_TYPES.DATE:
          return (
            <Input
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
              onChange={(e) => {
                doUpdate(column.id, e.target.value)
              }}
              value={
                column.id in updatedFields
                  ? dateToString(updatedFields[column.id])
                  : defaultValue
                  ? dateToString(defaultValue)
                  : ''
              }
              label={column.label}
              {...props}
            />
          )
        case FIELD_TYPES.AVATAR_ARRAY:
          return (
            <ToggleAvatarArray
              updatedFields={updatedFields}
              doUpdate={doUpdate}
              defaultValue={defaultValue}
            />
          )
        case FIELD_TYPES.MULTILINE:
          return (
            <>
              <Button onClick={() => setOpenInputMultiline(true)}>
                Click here to edit : {multilineValue?.substring(0, 20)}...
              </Button>
              <Modal
                sx={{ overflow: 'scroll' }}
                top="80%"
                open={openInputMultiline}
                setOpen={setOpenInputMultiline}
              >
                <Box textAlign="center">
                  <Typography fontSize="h5.fontSize">
                    To create more complexe texts you can use this website :
                  </Typography>
                  <Link target="_blank" href="https://html-online.com/editor/">
                    https://html-online.com/editor/
                  </Link>
                </Box>
                <Typography>
                  <b>New module :</b> Write on the left, copy paste the code on
                  the right there
                </Typography>
                <Typography>
                  <b>Editing a module :</b> Copy paste current text on the
                  right, edit on the left then copy paste the new text on the
                  right there (replace the previous)
                </Typography>
                <Input
                  multiline
                  onChange={(e) => {
                    doUpdate(column.id, e.target.value)
                  }}
                  value={
                    column.id in updatedFields
                      ? updatedFields[column.id]
                      : defaultValue || ''
                  }
                  label={column.label}
                  sx={{ width: '100%' }}
                  {...props}
                />
                <Button
                  sx={{ width: '100%' }}
                  onClick={() => setOpenInputMultiline(false)}
                >
                  Ok
                </Button>
              </Modal>
            </>
          )
        case FIELD_TYPES.AUTOCOMPLETE_MULTIPLE:
          return (
            <Autocomplete
              multiple
              id={column.id}
              options={column.options || []}
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : column?.options.length
                  ? column.valuesCallback(defaultValue, column.options || []) ||
                    []
                  : []
              }
              onChange={(event, newValue) => {
                doUpdate(column.id, newValue)
              }}
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
              {defaultValue && new Date(defaultValue).toLocaleString()}
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
              canZoom={true}
            />
          )
        case FIELD_TYPES.MULTILINE:
          return (
            <Typography {...props} color="textSecondary">
              {defaultValue?.substring(0, 20)}...
            </Typography>
          )
        case FIELD_TYPES.AUTOCOMPLETE_MULTIPLE:
          return (
            <Autocomplete
              multiple
              disabled
              id={column.id}
              options={column.options || []}
              value={
                column.id in updatedFields
                  ? updatedFields[column.id]
                  : column?.options.length
                  ? column.valuesCallback(defaultValue, column.options || []) ||
                    []
                  : []
              }
              onChange={(event, newValue) => {
                doUpdate(column.id, newValue)
              }}
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
