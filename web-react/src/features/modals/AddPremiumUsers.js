import { Typography } from '@mui/material'
import React, { useState } from 'react'
import { CTAButton } from '../../ui/Button'
import Flex from '../../ui/Flex'
import Modal from '../../ui/Modal'
import { Input } from '../../ui/Form'
import { useMutation, gql } from '@apollo/client'
import AreYouSure from './AreYouSure'

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
  const [date, setDate] = useState(new Date())
  const [areYouSure, setAreYouSure] = useState(false)
  return (
    <>
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
              setAreYouSure(true)
            }}
          >
            Confirm
          </CTAButton>
        </Flex>
      </Modal>
      <AreYouSure
        open={areYouSure}
        setOpen={setAreYouSure}
        onConfirm={() => {
          setPremiumMultipleUsers({
            variables: { endingDate: date, userIds: selectedUsers },
          })
        }}
        text={'Are you sure you want to make these users premium?'}
      />
    </>
  )
}

export default AddPremiumUsers
