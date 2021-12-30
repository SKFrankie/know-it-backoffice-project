import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Loading from '../ui/Loading'
import Table from '../features/Table'
import { Box } from '@mui/material'
import SearchBar from '../features/SearchBar'
import { FIELD_TYPES } from '../helpers/constants'

const GET_USERS = gql`
  query Users(
    $limit: Int
    $offset: Int
    $orderBy: [UserSort]
    $filter: UserWhere
  ) {
    users(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      userId

      mail
      username
      age
      country
      lastSeen
      daysInArow

      createdAt
      isPremium
      coins
      stars
      currentAvatar {
        name
        picture
      }
    }
    usersAggregate(where: $filter) {
      count
    }
  }
`

const Users = () => {
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      limit: defaultLimit,
    },
  })
  const columns = [
    { id: 'mail', numeric: false, disablePadding: false, label: 'Mail' },
    {
      id: 'username',
      numeric: false,
      disablePadding: false,
      label: 'Username',
    },
    {
      id: 'age',
      numeric: true,
      disablePadding: false,
      label: 'Age',
      type: FIELD_TYPES.NUMBER,
    },
    { id: 'country', numeric: false, disablePadding: false, label: 'Country' },
    {
      id: 'lastSeen',
      numeric: true,
      disablePadding: false,
      label: 'Last Seen',
      type: FIELD_TYPES.DATE,
    },
    {
      id: 'daysInArow',
      numeric: true,
      disablePadding: false,
      label: 'Days in a row',
      type: FIELD_TYPES.NUMBER,
    },
  ]

  const extraColumns = [
    {
      id: 'createdAt',
      numeric: true,
      disablePadding: false,
      label: 'Created At',
      type: FIELD_TYPES.DATE,
    },
    {
      id: 'isPremium',
      numeric: true,
      disablePadding: false,
      label: 'Is Premium',
      type: FIELD_TYPES.BOOLEAN,
    },
    {
      id: 'coins',
      numeric: true,
      disablePadding: false,
      label: 'Coins',
      type: FIELD_TYPES.NUMBER,
    },
    {
      id: 'stars',
      numeric: true,
      disablePadding: false,
      label: 'Stars',
      type: FIELD_TYPES.NUMBER,
    },
    {
      id: 'currentAvatar',
      child: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Current Avatar',
      type: FIELD_TYPES.PICTURE,
    },
  ]
  return (
    <>
      <Box>
        <SearchBar searchFields={columns} refetch={refetch} />
        {loading && <Loading />} {error && 'error'}
        {data && (
          <Table
            tableName="Users"
            headCells={columns}
            rows={data.users}
            extraColumns={extraColumns}
            refetch={refetch}
            count={data.usersAggregate.count}
            limit={defaultLimit}
            hasCheckbox={false}
          />
        )}
      </Box>
    </>
  )
}

export default Users
