import {
  Button,
  Modal,
  Alert,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  AlertTitle,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CTAButton } from '../../ui/Button'
import { Column } from '../../ui/Flex'
import Form, { Input, Select } from '../../ui/Form'
import { useMutation, gql } from '@apollo/client'
import { RIGHTS } from '../../helpers/constants'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 6,
  pb: 3,
}

const INVITE = gql`
  mutation InviteSuperUser($mail: String!, $rights: Right!) {
    inviteSuperUser(mail: $mail, rights: $rights)
  }
`

const Invite = () => {
  // todo faire un sytème de mail pour les super users ou pouvoir récupérer un nouveau lien d'invitation au cas ou il se perd
  const invitationSubject = 'Join the Know It Team!'
  const invitationBody =
    'Joins us by clicking this authentication link and create your password : '
  const [invite, { loading }] = useMutation(INVITE, {
    onError(err) {
      console.log(err)
      setError(err)
    },
    onCompleted(data) {
      setData(data)
    },
  })

  const sendWithGmail = () => {
    navigator.clipboard.writeText(data.inviteSuperUser)
    setTimeout(() => {
      const win = window.open(
        `https://mail.google.com/mail/u/0/?fs=1&to=${mail}&su=${invitationSubject}&body=${invitationBody} ${data.inviteSuperUser}&tf=cm`,
        '_blank'
      )
      win.focus()
    }, 1000)
  }

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const [open, setOpen] = React.useState(false)
  const [mail, setMail] = useState('')
  const [rights, setRights] = useState(RIGHTS[2])

  useEffect(() => {
    setError(null)
    setData(null)
  }, [mail])
  useEffect(() => {
    if (data) {
      sendWithGmail()
    }
  }, [data])

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setMail('')
    setOpen(false)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    invite({
      variables: {
        mail,
        rights: rights.id,
      },
    })
  }
  const handleRights = (e) => {
    const tmpRights = RIGHTS.find((field) => field.id === e.target.value)
    setRights(tmpRights)
  }
  return (
    <>
      <Button onClick={handleOpen}>Send admin invitation</Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Column
            sx={{
              textAlign: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" color="textPrimary">
              Admin Invitation
            </Typography>
            <Form
              onSubmit={handleSubmit}
              style={{ margin: '5%', width: '100%' }}
            >
              {error && !loading && (
                <Alert sx={{ m: 1 }} severity="error">
                  <AlertTitle>Error</AlertTitle>
                  <strong>{mail}</strong> might already be registered
                </Alert>
              )}
              {data && (
                <Alert sx={{ m: 1 }} severity="success">
                  <AlertTitle>Success</AlertTitle>
                  Invitation link for <strong>{mail}</strong> has been copied to
                  your clipboard! Send it to the user.
                </Alert>
              )}
              <Input
                type="email"
                required
                label="Email"
                autoComplete="email"
                onChange={(e) => {
                  setMail(e.target.value)
                }}
              />
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="select-right">Rights</InputLabel>
                <Select
                  labelId="select-right"
                  value={rights.id}
                  label={rights.label}
                  onChange={handleRights}
                  inputProps={{ 'aria-label': 'Without label' }}
                  sx={{ m: 1 }}
                >
                  {RIGHTS.map((right) => (
                    <MenuItem key={right.id} value={right.id}>
                      {right.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <CTAButton type="submit">Get invitation link</CTAButton>
            </Form>
          </Column>
        </Box>
      </Modal>
    </>
  )
}

export default Invite
