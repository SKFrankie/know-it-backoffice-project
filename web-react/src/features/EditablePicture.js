import React, { useState } from 'react'
import openWidget from '../helpers/widget'
import Button from '../ui/Button'
import { Column } from '../ui/Flex'
import Modal from '../ui/Modal'

const EditablePicture = ({
  editMode = false,
  column,
  updatedFields = {},
  defaultValue,
  doUpdate,
  canZoom = false,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const fallback =
    'https://res.cloudinary.com/dki7jzqlx/image/upload/v1638871483/default_frame.png'
  const zoomPicture = () => {
    if (!canZoom) {
      return
    }
    setOpen(true)
  }
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
        style={{
          maxWidth: '7vw',
          maxHeight: '7vw',
          cursor: canZoom ? 'zoom-in' : 'inherit',
        }}
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
        onClick={zoomPicture}
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
      <ZoomedPicture
        open={open}
        setOpen={setOpen}
        src={
          column.id in updatedFields
            ? updatedFields[column.id]
            : defaultValue || ''
        }
        alt={column.label}
      />
    </Column>
  )
}

const ZoomedPicture = ({
  onCancel = () => {
    setOpen(false)
  },
  open,
  setOpen,
  src,
  alt,
}) => {
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      onClose={onCancel}
      moreStyle={{ width: 'auto' }}
    >
      <img
        style={{
          height: '60vh',
          width: 'auto',
        }}
        src={src}
        alt={alt}
      />
    </Modal>
  )
}

export default EditablePicture
