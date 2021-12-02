import React from 'react'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault'
import { Typography } from '@mui/material'
import { ButtonLinkUnstyled } from '../ui/Button'
import { Box } from '@mui/system'

const SectionButton = ({
  label,
  description = '',
  href,
  Icon = DisabledByDefaultIcon,
  sx,
  ...props
}) => {
  return (
    <ButtonLinkUnstyled
      sx={{
        m: 3,
        width: '17vw',
        minHeight: '10vw',
        border: 1,
        borderRadius: 3,
        ...sx,
      }}
      color="secondary"
      href={href}
      {...props}
    >
      <Box sx={{ flexDirection: 'column', textAlign: 'center' }}>
        <Icon style={{ color: 'black' }} />
        <Typography color="black" variant="h6">
          {label}
        </Typography>
        <Typography variant="caption">{description}</Typography>
      </Box>
    </ButtonLinkUnstyled>
  )
}

export default SectionButton
