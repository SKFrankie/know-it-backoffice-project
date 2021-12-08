import React, { useContext } from 'react'
import Avatars from '../Avatars'
import { FIELD_TYPES } from '../../helpers/constants'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../ui/Loading'
import { SuperUserContext } from '../../context'
import CollectionTable from '../../features/CollectionTable'

const GET_AVATAR_COLLECTIONS = gql`
  query AvatarCollections(
    $limit: Int
    $offset: Int
    $orderBy: [AvatarCollectionSort]
    $filter: AvatarCollectionWhere
  ) {
    avatarCollections(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      avatarCollectionId
      name
      startDate
      endDate
      avatars {
        avatarId
        name
        picture
        coinPrice
      }
    }
    avatarCollectionsAggregate(where: $filter) {
      count
    }
  }
`
const SET_AVATAR_COLLECTIONS = gql`
  mutation setAvatarCollections(
    $avatarCollectionId: ID!
    $name: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    updateAvatarCollections(
      where: { avatarCollectionId: $avatarCollectionId }
      update: { name: $name, startDate: $startDate, endDate: $endDate }
    ) {
      avatarCollections {
        avatarCollectionId
      }
    }
  }
`
const CREATE_AVATAR_COLLECTION = gql`
  mutation CreateAvatarCollections(
    $name: String!
    $startDate: DateTime
    $endDate: DateTime
  ) {
    createAvatarCollections(
      input: { name: $name, startDate: $startDate, endDate: $endDate }
    ) {
      avatarCollections {
        avatarCollectionId
      }
    }
  }
`

const columns = [
  {
    id: 'name',
    disablePadding: false,
    label: 'Name',
    editable: true,
    required: true,
  },
  {
    id: 'startDate',
    disablePadding: false,
    label: 'Start Date',
    editable: true,
    type: FIELD_TYPES.DATE,
  },
  {
    id: 'endDate',
    disablePadding: false,
    label: 'End Date',
    editable: true,
    type: FIELD_TYPES.DATE,
  },
]

const AvatarCollectionTable = () => {
  const allowed = ['ADMIN', 'EDITOR']

  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_AVATAR_COLLECTIONS, {
    variables: {
      limit: defaultLimit,
    },
    onError(error) {
      console.log('get', error)
    },
  })
  return (
    <Avatars
      columns={columns}
      createText={'Create new Avatar Collection'}
      QUERY={CREATE_AVATAR_COLLECTION}
      refetch={refetch}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <CollectionTable
          tableName="Avatar Collections"
          headCells={columns}
          rows={data.avatarCollections}
          refetch={refetch}
          count={data.avatarCollectionsAggregate.count}
          limit={defaultLimit}
          canEdit={allowed.includes(superCurrentUser.rights)}
          QUERY={SET_AVATAR_COLLECTIONS}
          // deleteItem={deleteAvatar}
          id={'avatarCollectionId'}
        />
      )}
    </Avatars>
  )
}

export default AvatarCollectionTable
