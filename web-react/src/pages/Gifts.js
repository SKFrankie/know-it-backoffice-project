import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import SearchBar from '../features/SearchBar'
import { FIELD_TYPES, REWARDS } from '../helpers/constants'
import { gql, useMutation, useQuery } from '@apollo/client'
import Loading from '../ui/Loading'
import PictureTable from '../features/PictureTable'
import { SuperUserContext } from '../context'

const CREATE_GIFTS = gql`
  mutation CreateGifts($gifts: [GiftCreateInput!]!) {
    createGifts(input: $gifts) {
      gifts {
        giftId
      }
    }
  }
`
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
    left: '0',
    type: FIELD_TYPES.NUMBER,
    beforeText: 'Day',
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
    beforeText: 'x',
  },
]

const Gifts = () => {
  const superCurrentUser = useContext(SuperUserContext)

  const [createGifts] = useMutation(CREATE_GIFTS, {
    onCompleted: () => {
      refetch()
    },
    onError: (error) => {
      console.log(error)
    },
  })
  const createMissingGifts = (number) => {
    // this is a hack to create missing gifts on first page load
    const gifts = []
    for (let i = number; i < 25; i++) {
      const day = i + 1
      const gift = {
        day,
        reward: REWARDS[0].id,
        quantity: 0,
      }
      gifts.push(gift)
    }
    createGifts({ variables: { gifts } })
  }

  const { data, loading, error, refetch } = useQuery(GET_GIFTS, {
    variables: {
      orderBy: [{ day: 'ASC' }],
    },
    onCompleted: (res) => {
      if (res.giftsAggregate.count < 25) {
        createMissingGifts(res.giftsAggregate.count)
      }
    },
    onError(error) {
      console.log('get', error)
    },
  })
  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Box>
      <Box>
        <Typography
          fontWeight={500}
          mb={3}
          color="textPrimary"
          textAlign="center"
          variant="h5"
        >
          Calendar Gifts
        </Typography>
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
            pictureMapping={REWARDS}
          />
        )}
      </Box>
    </Box>
  )
}

export default Gifts
