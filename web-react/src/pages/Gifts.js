import React, { useContext } from 'react'
import { Box } from '@mui/material'
import SearchBar from '../features/SearchBar'
import { FIELD_TYPES, REWARDS } from '../helpers/constants'
import { gql, useQuery } from '@apollo/client'
import Loading from '../ui/Loading'
import PictureTable from '../features/PictureTable'
import { SuperUserContext } from '../context'

const GET_GIFTS = gql`
  query Gifts(
    $limit: Int
    $offset: Int
    $orderBy: [GiftSort]
    $filter: GiftWhere
  ) {
    gifts(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      giftId
      day
      reward
      quantity
    }
    giftsAggregate(where: $filter) {
      count
    }
  }
`
const SET_GIFTS = gql`
  mutation setGifts(
    $giftId: ID!
    $day: Int
    $reward: RewardType
    $quantity: Int
  ) {
    updateGifts(
      where: { giftId: $giftId }
      update: { day: $day, reward: $reward, quantity: $quantity }
    ) {
      gifts {
        giftId
      }
    }
  }
`

const columns = [
  {
    id: 'reward',
    disablePadding: false,
    label: 'Reward',
    editable: true,
    required: true,
    selectValues: REWARDS,
    type: FIELD_TYPES.SELECT,
  },
  {
    id: 'day',
    disablePadding: false,
    label: 'day',
    editable: true,
    required: true,
    disabled: true,
    numeric: true,
    top: '0',
    right: '0',
    type: FIELD_TYPES.NUMBER,
  },
  {
    id: 'quantity',
    disablePadding: false,
    label: 'Quantity',
    editable: true,
    required: true,
    numeric: true,
    left: '0',
    bottom: '0',
    type: FIELD_TYPES.NUMBER,
  },
]

const Gifts = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const { data, loading, error, refetch } = useQuery(GET_GIFTS, {
    variables: {
      limit: 10,
    },
    onError(error) {
      console.log('get', error)
    },
  })
  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Box>
      <Box>
        <SearchBar
          sx={{ flexGrow: 1 }}
          searchFields={columns}
          refetch={refetch}
        />
        {loading && <Loading />} {error && 'error'}
        {data && (
          <PictureTable
            tableName="Gifts"
            headCells={columns}
            rows={data.gifts}
            refetch={refetch}
            count={data?.giftsAggregate?.count}
            canEdit={allowed.includes(superCurrentUser.rights)}
            QUERY={SET_GIFTS}
            // deleteItem={deleteAvatar}
            id={'giftId'}
            pictureId="reward"
          />
        )}
      </Box>
    </Box>
  )
}

export default Gifts
