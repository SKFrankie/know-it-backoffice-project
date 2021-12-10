import React from 'react'
import { Box } from '@mui/material'
import { AVATAR_PAGES } from '../helpers/constants'
import Flex, { Column } from '../ui/Flex'
import { MenuButtons } from '../features/Header'
import CreateNew from '../features/modals/CreateNew'
import SearchBar from '../features/SearchBar'

const Avatars = ({
  children,
  columns,
  createText,
  QUERY,
  customMutation = null,
  refetch,
  noHeader = false,
  noSearchBar = false,
  filter = null,
  ...props
}) => {
  return (
    <Box {...props}>
      <Flex style={{ display: noHeader ? 'none' : 'flex' }}>
        <Column sx={{ flexGrow: 1 }}>
          <MenuButtons sections={AVATAR_PAGES} />
        </Column>
        <CreateNew
          name={createText}
          columns={columns}
          QUERY={QUERY}
          customMutation={customMutation}
          refetch={refetch}
        />
      </Flex>
      <Box>
        <SearchBar
          sx={{ flexGrow: 1, display: noSearchBar ? 'none' : 'block' }}
          searchFields={columns}
          refetch={refetch}
          filter={filter}
        />
        {children}
      </Box>
    </Box>
  )
}

export default Avatars
