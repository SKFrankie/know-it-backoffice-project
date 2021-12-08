import React from 'react'
import { Box } from '@mui/material'
import { AVATAR_PAGES } from '../helpers/constants'
import Flex, { Column } from '../ui/Flex'
import { MenuButtons } from '../features/Header'
import CreateNew from '../features/modals/CreateNew'
import SearchBar from '../features/SearchBar'

const Avatars = ({ children, columns, createText, QUERY, refetch }) => {
  return (
    <Box>
      <Flex>
        <Column sx={{ flexGrow: 1 }}>
          <MenuButtons sections={AVATAR_PAGES} />
        </Column>
        <CreateNew
          name={createText}
          columns={columns}
          QUERY={QUERY}
          refetch={refetch}
        />
      </Flex>
      <Box>
        <SearchBar
          sx={{ flexGrow: 1 }}
          searchFields={columns}
          refetch={refetch}
        />
        {children}
      </Box>
    </Box>
  )
}

export default Avatars
