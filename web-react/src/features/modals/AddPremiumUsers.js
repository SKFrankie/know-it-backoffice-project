import { Typography } from '@mui/material'
import React from 'react'
import { CTAButton } from '../../ui/Button'
import Flex from '../../ui/Flex'
import Modal from '../../ui/Modal'

const AddPremiumUsers = ({ open, setOpen, refetch, selectedUsers }) => {
  console.log('selected', selectedUsers)
  return (
    <Modal open={open} setOpen={setOpen}>
      <Typography m={4} textAlign="center" variant="h5">
        text
      </Typography>
      <Flex>
        <CTAButton
          variant="outlined"
          color="error"
          onClick={() => {
            refetch()
            setOpen(false)
          }}
        >
          Yes
        </CTAButton>
      </Flex>
    </Modal>
  )
}

export default AddPremiumUsers
