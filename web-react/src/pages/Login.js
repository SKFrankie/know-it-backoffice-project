import { Typography } from '@mui/material'
import React from 'react'
import { CTAButton } from '../ui/Button'
import { Column } from '../ui/Flex'
import Form, { Input } from '../ui/Form'

const Login = () => {
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
      <Form sx={{ margin: '5%', width: '40%' }}>
        <Input type="email" required label="email" />
        <Input
          sx={{ border: '0px' }}
          type="password"
          required
          label="password"
        />
        <CTAButton type="submit">Login</CTAButton>
      </Form>
    </Column>
  )
}

export default Login
