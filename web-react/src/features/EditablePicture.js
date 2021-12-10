import React from 'react'
import openWidget from '../helpers/widget'
import Button from '../ui/Button'
import { Column } from '../ui/Flex'

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
    <Column
      textAlign="center"
      sx={{
        width: '10vw',
        height: '10vw',
        placeSelf: 'center',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="imageBackground"
    >
      <img
        style={{ maxWidth: '7vw', maxHeight: '7vw' }}
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
    </Column>
  )
}

export default EditablePicture
