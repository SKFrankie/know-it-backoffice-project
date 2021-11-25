import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import Button, { ButtonLink } from '../ui/Button'
import React from 'react'

const Header = () => {
  return (
    <Box mb={5}>
      <AppBar
        position="static"
        mb={2}
        style={{
          backgroundColor: 'white',
        }}
      >
        <Toolbar
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Logo />
            <MenuButtons />
          </Box>
          <Logout />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

const Logo = () => {
  return (
    <ButtonLink href="/">
      <Box sx={{ m: '5' }}>
        <Typography color="textPrimary" variant="h5">
          <Box fontWeight="600">Know It!</Box>
        </Typography>
        <Typography color="textSecondary" variant="caption">
          Admin panel
        </Typography>
      </Box>
    </ButtonLink>
  )
}

const MenuButtons = () => {
  const headersData = [
    { label: 'Analytics', href: 'test' },
    { label: 'Users', href: '' },
    { label: 'Admin', href: '' },
    { label: 'Games', href: '' },
    { label: 'Avatars', href: '' },
    { label: 'Gifts', href: '' },
  ]
  return (
    <Box>
      {headersData.map(({ label, href }) => {
        return (
          <ButtonLink
            key={label}
            style={{ textTransform: 'uppercase' }}
            href={href}
            label={label}
          >
            <Typography color="textSecondary" fontWeight="medium">
              {label}
            </Typography>
          </ButtonLink>
        )
      })}
    </Box>
  )
}

const Logout = () => {
  return (
    <Button>
      <Box>
        <Typography color="textSecondary" variant="caption">
          Logged as ...
        </Typography>
        <Typography color="textPrimary" variant="h6">
          <Box fontWeight="600">Logout</Box>
        </Typography>
      </Box>
    </Button>
  )
}

export default Header
