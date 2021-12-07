import { Box } from '@mui/material'
import React from 'react'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

const EditablePicture = ({
  editMode = false,
  column,
  updatedFields = {},
  doUpdate,
  defaultValue,
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
          <WidgetLoader />
          <Widget
            sources={['local', 'url']}
            cropping={false}
            resourceType={'image'}
            cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
            uploadPreset={process.env.REACT_APP_CLOUDINARY_UNSIGNED_PRESET}
            buttonText={`Upload`}
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
            folder={column.label}
            onSuccess={(result) => {
              console.log('res', result)
              doUpdate(column.id, result.info.url)
            }}
            onFailure={(response) => {
              console.log('error', response.error)
            }}
            logging={false}
            type="button"
            buttonType="button"
          />
        </>
      )}
    </Box>
  )
}

export default EditablePicture
