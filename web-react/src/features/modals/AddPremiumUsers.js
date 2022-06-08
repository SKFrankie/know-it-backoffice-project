import { Typography } from '@mui/material'
import React, { useState } from 'react'
import { CTAButton } from '../../ui/Button'
import Flex from '../../ui/Flex'
import Modal from '../../ui/Modal'
import { Input } from '../../ui/Form'
import { useMutation, gql } from '@apollo/client'

const ADD_PREMIUM_USERS = gql`
  mutation setPremiumMultipleUsers($endingDate: DateTime!, $userIds: [ID]) {
    setPremiumMultipleUsers(endingDate: $endingDate, userIds: $userIds)
  }
`

const AddPremiumUsers = ({ open, setOpen, refetch, selectedUsers }) => {
  const [setPremiumMultipleUsers] = useMutation(ADD_PREMIUM_USERS, {
    onCompleted() {
      console.log('premium users added')
      refetch()
      setOpen(false)
    },
    onError(error) {
      console.log(error)
    },
  })
  console.log('selected', selectedUsers)
  const [date, setDate] = useState(new Date())
  return (
    <Modal moreStyle={{ width: '50%' }} open={open} setOpen={setOpen}>
      <Typography m={4} textAlign="center" variant="h5">
        Select a premium subscription ending date for selected users
      </Typography>
      <Input
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ width: '100%' }}
        type="date"
        onChange={(e) => {
          setDate(e.target.value)
        }}
        label="Ending Date"
      />
      <Flex>
        <CTAButton
          variant="outlined"
          onClick={() => {
            setPremiumMultipleUsers({
              variables: { endingDate: date, userIds: selectedUsers },
            })
          }}
        >
          Confirm
        </CTAButton>
      </Flex>
    </Modal>
  )
}

export default AddPremiumUsers
