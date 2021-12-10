import React, { useContext } from 'react'
import Avatars from '../Avatars'
import { FIELD_TYPES } from '../../helpers/constants'
import { gql, useMutation, useQuery } from '@apollo/client'
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
        picture
        name
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
    $avatarIds: [ID!]!
  ) {
    updateAvatarCollections(
      where: { avatarCollectionId: $avatarCollectionId }
      update: { name: $name, startDate: $startDate, endDate: $endDate }
    ) {
      avatarCollections {
        avatarCollectionId
      }
    }
    toggleAvatarsToCollection(
      avatarIds: $avatarIds
      avatarCollectionId: $avatarCollectionId
    ) {
      avatarCollectionId
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

const DELETE_AVATAR_COLLECTION = gql`
  mutation DeleteAvatarCollection($avatarCollectionId: ID!) {
    deleteAvatarCollections(
      where: { avatarCollectionId: $avatarCollectionId }
    ) {
      bookmark
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
  {
    id: 'avatars_hack_id',
    disablePadding: false,
    label: 'Avatars',
    editable: true,
    type: FIELD_TYPES.AVATAR_ARRAY,
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
  const [deleteAvatarCollection] = useMutation(DELETE_AVATAR_COLLECTION, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
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
          subRows="avatars"
          refetch={refetch}
          count={data.avatarCollectionsAggregate.count}
          limit={defaultLimit}
          canEdit={allowed.includes(superCurrentUser.rights)}
          QUERY={SET_AVATAR_COLLECTIONS}
          additionalFields={{ avatarIds: [] }}
          deleteItem={deleteAvatarCollection}
          id={'avatarCollectionId'}
        />
      )}
    </Avatars>
  )
}

export default AvatarCollectionTable
