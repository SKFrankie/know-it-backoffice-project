import React from 'react'
import { Modal as MUIModal, Box } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  borderRadius: '20px',
  pt: 2,
  px: 6,
  pb: 3,
}

const Modal = ({
  children,
  setOpen,
  open,
  onClose = () => {
    return
  },
  ...props
}) => {
  const handleClose = () => {
    onClose()
    setOpen(false)
  }
  return (
    <MUIModal open={open} onClose={handleClose} {...props}>
      <Box sx={style}>{children}</Box>
    </MUIModal>
  )
}

export default Modal
