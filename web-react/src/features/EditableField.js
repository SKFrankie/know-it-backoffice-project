import { Autocomplete, TextField, Typography } from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import React, { useState, useRef } from 'react'
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
  const editorRef = useRef(null)
  const richTextUpdate = (columnId) => {
    if (editorRef.current) {
      doUpdate(columnId, editorRef.current.getContent())
    }
    setOpenInputMultiline(false)
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
                open={openInputMultiline}
                setOpen={setOpenInputMultiline}
                onClose={() => richTextUpdate(column.id)}
              >
                <Editor
                  apiKey="026c1wi22jjw1w0hkxdsxiwpt96440dvpuygaojytimbluf6"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={
                    column.id in updatedFields
                      ? updatedFields[column.id]
                      : defaultValue || ''
                  }
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'code',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                      'code',
                      'help',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo | blocks |' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify table tabledelete | bullist numlist outdent indent |' +
                      'removeformat | help',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }}
                />
                <Button
                  sx={{ width: '100%' }}
                  onClick={() => richTextUpdate(column.id)}
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
