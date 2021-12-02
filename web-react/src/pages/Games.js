import { Box } from '@mui/material'
import React from 'react'
import SectionButton from '../features/SectionButton'
import { GAMES } from '../helpers/constants'

const Games = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      {GAMES.map(({ icon, label, href }) => (
        <SectionButton
          sx={{ m: 5 }}
          Icon={icon}
          key={label}
          label={label}
          href={href}
        />
      ))}
    </Box>
  )
}

export default Games
