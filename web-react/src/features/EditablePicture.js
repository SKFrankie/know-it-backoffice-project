import { Box } from '@mui/material'
import React from 'react'
import openWidget from '../helpers/widget'
import Button from '../ui/Button'

const EditablePicture = ({
  editMode = false,
  column,
  updatedFields = {},
  defaultValue,
  doUpdate,
  ...props
}) => {
  const fallback =
    'https://res.cloudinary.com/dki7jzqlx/image/upload/v1638871483/default_frame.png'
  return (
    <Box
      textAlign="center"
      sx={{
        maxWidth: 'fit-content',
        placeSelf: 'center',
        position: 'relative',
      }}
    >
      <img
        style={{ maxWidth: '10vw', maxHeight: '10vh' }}
        src={
          column.id in updatedFields
            ? updatedFields[column.id]
            : defaultValue || ''
        }
        alt={column.label}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = fallback
        }}
        {...props}
      />
      {editMode && (
        <>
          <Button
            onClick={() => {
              openWidget((url) => doUpdate(column.id, url), column.label)
            }}
            style={{
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              height: '25px',
              alignSelf: 'center',
              cursor: 'pointer',
              backgroundColor: '#007EA7',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
            }}
          >
            Upload
          </Button>
        </>
      )}
    </Box>
  )
}

export default EditablePicture
