import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Loading from '../ui/Loading'
import Table from '../features/Table'

const GET_USERS = gql`
  query Users($limit: Int, $offset: Int) {
    users(options: { limit: $limit, offset: $offset }) {
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
      tickets
      currentAvatar {
        name
        picture
      }
    }
    usersCount
  }
`
const Users = () => {
  const defaultLimit = 1
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { limit: defaultLimit },
  })
  const columns = [
    { id: 'mail', numeric: false, disablePadding: false, label: 'Mail' },
    {
      id: 'username',
      numeric: false,
      disablePadding: false,
      label: 'Username',
    },
    { id: 'age', numeric: true, disablePadding: false, label: 'Age' },
    { id: 'country', numeric: false, disablePadding: false, label: 'Country' },
    {
      id: 'lastSeen',
      numeric: true,
      disablePadding: false,
      label: 'Last Seen',
    },
    {
      id: 'daysInArow',
      numeric: true,
      disablePadding: false,
      label: 'Days in a row',
    },
  ]

  const extraColumns = [
    {
      id: 'createdAt',
      numeric: true,
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'isPremium',
      numeric: true,
      disablePadding: false,
      label: 'Is Premium',
    },
    { id: 'coins', numeric: true, disablePadding: false, label: 'Coins' },
    { id: 'tickets', numeric: true, disablePadding: false, label: 'Tickets' },
    {
      id: 'currentAvatar',
      child: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Current Avatar',
    },
  ]
  return (
    <>
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Users"
          headCells={columns}
          rows={data.users}
          extraColumns={extraColumns}
          refetch={refetch}
          count={data.usersCount}
          limit={defaultLimit}
        />
      )}
    </>
  )
}

export default Users
