import { Box } from '@mui/material'
import React from 'react'
import SectionButton from '../features/SectionButton'
import { SECTIONS } from '../helpers/constants'

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      {SECTIONS.map(
        ({ label, longName, description, href, icon, external }) => (
          <SectionButton
            key={label}
            label={longName}
            description={description}
            href={href}
            Icon={icon}
            external={external}
          />
        )
      )}
    </Box>
  )
}

export default Home
