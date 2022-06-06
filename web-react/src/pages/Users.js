import React, { useState, useContext } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import Loading from '../ui/Loading'
import Table from '../features/Table'
import { Box } from '@mui/material'
import SearchBar from '../features/SearchBar'
import { SuperUserContext } from '../context'
import { FIELD_TYPES } from '../helpers/constants'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import AddPremiumUsers from '../features/modals/AddPremiumUsers'

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
      points
      premiumEndingDate
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

const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUsers(where: { userId: $userId }) {
      bookmark
    }
  }
`

const Users = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      limit: defaultLimit,
    },
  })
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
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
      id: 'premiumEndingDate',
      numeric: true,
      disablePadding: false,
      label: 'Premium ending date',
      type: FIELD_TYPES.DATE,
    },
    {
      id: 'points',
      numeric: true,
      disablePadding: false,
      label: 'Points',
      type: FIELD_TYPES.NUMBER,
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
      child: 'picture',
      numeric: false,
      disablePadding: false,
      label: 'Current Avatar',
      type: FIELD_TYPES.PICTURE,
    },
  ]

  const [openPremium, setOpenPremium] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])

  const handleOpenPremium = (selected) => {
    setSelectedUsers(selected)
    setOpenPremium(true)
  }

  return (
    <>
      <Box>
        <SearchBar searchFields={columns} refetch={refetch} />
        {loading && <Loading />} {error && 'error'}
        {data && (
          <Table
            toolbarOptions={[
              {
                icon: <WorkspacePremiumIcon />,
                onClick: handleOpenPremium,
                label: 'Set these users as premium',
                disabled: !superCurrentUser.rights === 'ADMIN',
              },
            ]}
            tableName="Users"
            headCells={columns}
            rows={data.users}
            extraColumns={extraColumns}
            refetch={refetch}
            count={data.usersAggregate.count}
            limit={defaultLimit}
            hasCheckbox={superCurrentUser.rights === 'ADMIN'}
            deleteItem={deleteUser}
            id={'userId'}
          />
        )}
      </Box>
      <AddPremiumUsers
        open={openPremium}
        setOpen={setOpenPremium}
        selectedUsers={selectedUsers}
        refetch={refetch}
      />
    </>
  )
}

export default Users
