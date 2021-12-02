import { Typography } from '@mui/material'
import React from 'react'
import { CTAButton } from '../../ui/Button'
import Flex from '../../ui/Flex'
import Modal from '../../ui/Modal'

const AreYouSure = ({
  text = 'Are you sure?',
  onConfirm,
  onCancel = () => {
    setOpen(false)
  },
  open,
  setOpen,
}) => {
  return (
    <Modal open={open} setOpen={setOpen} onClose={onCancel}>
      <Typography m={4} textAlign="center" variant="h5">
        {text}
      </Typography>
      <Flex>
        <CTAButton onClick={onCancel}>Cancel</CTAButton>
        <CTAButton
          variant="outlined"
          color="error"
          onClick={() => {
            onConfirm()
            setOpen(false)
          }}
        >
          Yes
        </CTAButton>
      </Flex>
    </Modal>
  )
}

export default AreYouSure
