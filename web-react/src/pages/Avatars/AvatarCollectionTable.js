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
const TOGGLE_AVATARS_COLLECTION = gql`
  mutation ToggleAvatarsCollection(
    $avatarCollectionId: ID!
    $avatarIds: [ID!]!
  ) {
    toggleAvatarsToCollection(
      avatarIds: $avatarIds
      avatarCollectionId: $avatarCollectionId
    ) {
      avatarCollectionId
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
      orderBy: { name: 'ASC' },
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

  const [createNew] = useMutation(CREATE_AVATAR_COLLECTION, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [toggleCollection] = useMutation(TOGGLE_AVATARS_COLLECTION, {
    onError(error) {
      console.log('avatar toggle error', error)
    },
  })
  const createMutation = async (variables, onCompleted, setError) => {
    const { name, startDate, endDate, avatarIds } = variables
    const createNewResponse = await createNew({
      variables: { name, startDate, endDate },
      onError(error) {
        console.log(error)
      },
    })
    if (createNewResponse?.data) {
      onCompleted(createNewResponse.data)
    } else {
      setError(
        'Error, this collection name might already exist, please try again'
      )
      return
    }

    const { avatarCollectionId } =
      createNewResponse.data.createAvatarCollections.avatarCollections[0]
    const toggleCollectionResponse = await toggleCollection({
      variables: { avatarCollectionId, avatarIds: avatarIds || [] },
      onError(error) {
        console.log(error)
      },
    })
    if (toggleCollectionResponse?.data) {
      onCompleted(toggleCollectionResponse.data)
    } else {
      setError(
        'Avatar Collection has been created but something went wrong with the avatars'
      )
    }
  }
  return (
    <Avatars
      columns={columns}
      createText={'Create new Avatar Collection'}
      customMutation={createMutation}
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
