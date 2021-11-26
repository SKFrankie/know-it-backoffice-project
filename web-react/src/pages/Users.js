import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { Box } from '@mui/material'
import Loading from '../ui/Loading'

const GET_USERS = gql`
  query Users {
    users {
      userId
      mail
      username
      coins
      tickets
      isPremium
      age
      country
      lastSeen
      createdAt
    }
  }
`
const Users = () => {
  const { data, loading, error } = useQuery(GET_USERS)
  return (
    <Box>
      {loading && <Loading />}{' '}
      {data &&
        data.users.map((user, index) => (
          <p key={index}>{user.username}</p>
        ))}{' '}
      {error && 'error'}
    </Box>
  )
}

export default Users
