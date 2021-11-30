import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Loading from '../ui/Loading'
import Table from '../features/Table'
import { Box } from '@mui/material'
import SearchBar from '../features/SearchBar'

const GET_SUPER_USERS = gql`
  query SuperUsers(
    $limit: Int
    $offset: Int
    $orderBy: [SuperUserSort]
    $filter: SuperUserWhere
  ) {
    superUsers(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      userId
      mail
      firstname
      lastname
      rights
      createdAt
    }
    superUsersAggregate(where: $filter) {
      count
    }
  }
`

const Admin = () => {
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_SUPER_USERS, {
    variables: {
      limit: defaultLimit,
    },
  })
  const columns = [
    { id: 'mail', numeric: false, disablePadding: false, label: 'Mail' },
    {
      id: 'firstname',
      numeric: false,
      disablePadding: false,
      label: 'Firstname',
    },
    {
      id: 'lastname',
      numeric: false,
      disablePadding: false,
      label: 'Lastname',
    },
    {
      id: 'rights',
      disablePadding: false,
      label: 'Rights',
      numeric: true,
    },
    {
      id: 'createdAt',
      numeric: true,
      disablePadding: false,
      label: 'Created At',
      datetime: true,
    },
  ]
  return (
    <>
      <Box>
        <SearchBar searchFields={columns} refetch={refetch} />
        {loading && <Loading />} {error && 'error'}
        {data && (
          <Table
            tableName="Admin users"
            headCells={columns}
            rows={data.superUsers}
            refetch={refetch}
            count={data.superUsersAggregate.count}
            limit={defaultLimit}
            hasCheckbox={false}
          />
        )}
      </Box>
    </>
  )
}

export default Admin
