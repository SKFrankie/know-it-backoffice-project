import React, { useContext } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../ui/Loading'
import Table from '../features/Table'
import { Box } from '@mui/material'
import SearchBar from '../features/SearchBar'
import Invite from '../features/modals/Invite'
import Flex from '../ui/Flex'
import { SuperUserContext } from '../context'
import { FIELD_TYPES, RIGHTS } from '../helpers/constants'

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

const SET_SUPER_USERS = gql`
  mutation setSuperUser(
    $userId: ID!
    $mail: String
    $firstname: String
    $lastname: String
    $rights: Right
  ) {
    updateSuperUsers(
      where: { userId: $userId }
      update: {
        mail: $mail
        firstname: $firstname
        lastname: $lastname
        rights: $rights
      }
    ) {
      superUsers {
        userId
        mail
        firstname
        lastname
        rights
        createdAt
      }
    }
  }
`

const DELETE_SUPER_USER = gql`
  mutation DeleteSuperUser($userId: ID!) {
    deleteSuperUsers(where: { userId: $userId }) {
      bookmark
    }
  }
`

const Admin = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_SUPER_USERS, {
    variables: {
      limit: defaultLimit,
    },
  })
  const [setSuperUser] = useMutation(SET_SUPER_USERS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [deleteSuperUser] = useMutation(DELETE_SUPER_USER, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })

  const columns = [
    {
      id: 'mail',
      numeric: false,
      disablePadding: false,
      label: 'Mail',
      editable: true,
    },
    {
      id: 'firstname',
      numeric: false,
      disablePadding: false,
      label: 'Firstname',
      editable: true,
    },
    {
      id: 'lastname',
      numeric: false,
      disablePadding: false,
      label: 'Lastname',
      editable: true,
    },
    {
      id: 'rights',
      disablePadding: false,
      label: 'Rights',
      selectValues: RIGHTS,
      editable: true,
      type: FIELD_TYPES.SELECT,
    },
    {
      id: 'createdAt',
      numeric: true,
      disablePadding: false,
      label: 'Created At',
      type: FIELD_TYPES.DATE,
    },
  ]
  return (
    <>
      <Box>
        <Flex>
          <SearchBar
            sx={{ flexGrow: 1 }}
            searchFields={columns}
            refetch={refetch}
          />
          {superCurrentUser.rights === 'ADMIN' && <Invite />}
        </Flex>
        {loading && <Loading />} {error && 'error'}
        {data && (
          <Table
            tableName="Admin users"
            headCells={columns}
            rows={data.superUsers}
            refetch={refetch}
            count={data.superUsersAggregate.count}
            limit={defaultLimit}
            hasCheckbox={superCurrentUser.rights === 'ADMIN'}
            canEdit={superCurrentUser.rights === 'ADMIN'}
            setFields={setSuperUser}
            deleteItem={deleteSuperUser}
            id={'userId'}
          />
        )}
      </Box>
    </>
  )
}

export default Admin
