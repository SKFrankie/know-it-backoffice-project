import React, { useContext } from 'react'
import { Box } from '@mui/material'
import { AVATAR_PAGES, FIELD_TYPES } from '../helpers/constants'
import Flex, { Column } from '../ui/Flex'
import { MenuButtons } from '../features/Header'
import { gql, useQuery } from '@apollo/client'
import CreateNew from '../features/modals/CreateNew'
import Loading from '../ui/Loading'
import SearchBar from '../features/SearchBar'
import PictureTable from '../features/PictureTable'
import { SuperUserContext } from '../context'

// add collection
const CREATE_AVATAR = gql`
  mutation CreateAvatars($name: String!, $picture: String!, $coinPrice: Int!) {
    createAvatars(
      input: { name: $name, picture: $picture, coinPrice: $coinPrice }
    ) {
      avatars {
        avatarId
      }
    }
  }
`

const GET_AVATARS = gql`
  query Avatars(
    $limit: Int
    $offset: Int
    $orderBy: [AvatarSort]
    $filter: AvatarWhere
  ) {
    avatars(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      avatarId
      picture
      name
      coinPrice
    }
    avatarsAggregate(where: $filter) {
      count
    }
  }
`

const SET_AVATARS = gql`
  mutation setAvatars(
    $avatarId: ID!
    $picture: String
    $name: String
    $coinPrice: Int
  ) {
    updateAvatars(
      where: { avatarId: $avatarId }
      update: { picture: $picture, name: $name, coinPrice: $coinPrice }
    ) {
      avatars {
        avatarId
      }
    }
  }
`

const columns = [
  {
    id: 'picture',
    disablePadding: false,
    label: 'Avatar Picture',
    editable: true,
    required: true,
    type: FIELD_TYPES.PICTURE,
  },
  {
    id: 'name',
    disablePadding: false,
    label: 'Name',
    editable: true,
    required: true,
    left: '0',
    bottom: '4px',
  },
  {
    id: 'coinPrice',
    disablePadding: false,
    label: 'Coin Price',
    editable: true,
    required: true,
    numeric: true,
    type: FIELD_TYPES.NUMBER,
    left: '0',
    top: '0',
    additionalText: 'coins',
  },
]

const Avatars = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_AVATARS, {
    variables: {
      limit: defaultLimit,
    },
    onError(error) {
      console.log('get', error)
    },
  })
  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Avatar
      columns={columns}
      createText={'Create new Avatar'}
      QUERY={CREATE_AVATAR}
      refetch={refetch}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <PictureTable
          tableName="Avatar"
          headCells={columns}
          rows={data.avatars}
          refetch={refetch}
          count={data.avatarsAggregate.count}
          limit={defaultLimit}
          // hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          QUERY={SET_AVATARS}
          // deleteItem={deleteFabVocabQuestions}
          id={'avatarId'}
        />
      )}
    </Avatar>
  )
}

const Avatar = ({ children, columns, createText, QUERY, refetch }) => {
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
