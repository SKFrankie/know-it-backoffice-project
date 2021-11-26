import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'

import { Alert, Typography } from '@mui/material'
import { CTAButton } from '../ui/Button'
import { Column } from '../ui/Flex'
import Form, { Input } from '../ui/Form'

const LOGIN = gql`
  mutation SuperLogin($mail: String!, $password: String!) {
    superLogin(mail: $mail, password: $password) {
      token
    }
  }
`

const Login = () => {
  const [login, { loading, error }] = useMutation(LOGIN, {
    onError(err) {
      console.log(err)
    },
    onCompleted(data) {
      localStorage.setItem('token', data.superLogin.token)
      location.reload()
    },
  })

  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    login({
      variables: {
        mail,
        password,
      },
    })
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
        Admin Panel
      </Typography>
      <Form onSubmit={handleSubmit} style={{ margin: '5%', width: '40%' }}>
        {error && !loading && (
          <Alert sx={{ m: 1 }} severity="warning">
            Mail or password incorrect
          </Alert>
        )}
        <Input
          type="email"
          required
          label="Email"
          onChange={(e) => {
            setMail(e.target.value)
          }}
        />
        <Input
          sx={{ border: '0px' }}
          type="password"
          required
          label="Password"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <CTAButton type="submit">Login</CTAButton>
      </Form>
    </Column>
  )
}

export default Login
