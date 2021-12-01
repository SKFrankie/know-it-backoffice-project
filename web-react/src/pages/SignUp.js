import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'

import { Alert, Typography } from '@mui/material'
import { CTAButton } from '../ui/Button'
import { Column } from '../ui/Flex'
import Form, { Input } from '../ui/Form'
import { useParams } from 'react-router'

const SIGNUP = gql`
  mutation SuperSignup(
    $token: String!
    $firstname: String
    $lastname: String
    $password: String!
  ) {
    superSignup(
      token: $token
      firstname: $firstname
      lastname: $lastname
      password: $password
    ) {
      token
    }
  }
`

const Signup = () => {
  const [signup, { loading, error }] = useMutation(SIGNUP, {
    onError(err) {
      console.log(err)
    },
    onCompleted(data) {
      localStorage.setItem('token', data.superSignup.token)
      location.reload()
    },
  })

  const { token } = useParams()
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (confirmPassword !== password) {
      return
    }
    signup({
      variables: {
        token,
        firstname,
        lastname,
        password,
      },
    })
  }

  const passwordNotOk = () => {
    return password !== confirmPassword || password === ''
  }

  return (
    <Column
      sx={{
        textAlign: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h1" color="textPrimary" fontWeight="400">
        Know It!
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Welcome to the Know It Team!
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Complete your account informations below to get started.
      </Typography>
      <Form onSubmit={handleSubmit} style={{ margin: '5%', width: '40%' }}>
        {error && !loading && (
          <Alert sx={{ m: 1 }} severity="warning">
            An error occured. Your invitation link might be invalid.
          </Alert>
        )}
        <Input
          type="text"
          label="Firstname"
          autoComplete="firstname"
          onChange={(e) => {
            setFirstname(e.target.value)
          }}
        />
        <Input
          type="text"
          label="Lastname"
          autoComplete="lastname"
          onChange={(e) => {
            setLastname(e.target.value)
          }}
        />
        <Input
          sx={{ border: '0px' }}
          type="password"
          required
          label="Password"
          autoComplete="current-password"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <Input
          sx={{ border: '0px' }}
          type="password"
          required
          label="Confirm password"
          autoComplete="current-password"
          onChange={(e) => {
            setConfirmPassword(e.target.value)
          }}
        />
        <CTAButton disabled={passwordNotOk()} type="submit">
          Sign up
        </CTAButton>
        {passwordNotOk() && password !== '' && (
          <Alert sx={{ m: 1 }} severity="warning">
            Passwords don&apos;t match
          </Alert>
        )}
      </Form>
    </Column>
  )
}

export default Signup
