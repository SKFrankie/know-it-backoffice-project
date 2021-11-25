import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import Button, { ButtonLink } from '../ui/Button'
import React from 'react'
import { SECTIONS } from '../helpers/constants'

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
      <Box mr={5}>
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
  return (
    <Box>
      {SECTIONS.map(({ label, href }) => {
        return (
          <ButtonLink
            key={label}
            style={{ textTransform: 'uppercase', color: '#7B9497' }}
            href={href}
            label={label}
            activeStyle={{ color: '#007EA7' }}
          >
            <Typography fontWeight="medium">{label}</Typography>
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
        <Typography color="textPrimary" variant="medium">
          <Box fontWeight="500">Logout</Box>
        </Typography>
      </Box>
    </Button>
  )
}

export default Header
