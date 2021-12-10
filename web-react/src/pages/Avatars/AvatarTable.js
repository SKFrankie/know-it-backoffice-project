import React, { useContext } from 'react'
import { FIELD_TYPES } from '../../helpers/constants'
import { gql, useMutation, useQuery } from '@apollo/client'
import Loading from '../../ui/Loading'
import PictureTable from '../../features/PictureTable'
import { SuperUserContext } from '../../context'
import Avatars from '../Avatars'

// add collection
const CREATE_AVATAR = gql`
  mutation CreateAvatars($name: String!, $picture: String!, $coinPrice: Int!) {
    createAvatars(
      input: { name: $name, picture: $picture, coinPrice: $coinPrice }
    ) {
      avatars {
        avatarId
      }
    }
  }
`

const GET_AVATARS = gql`
  query Avatars(
    $limit: Int
    $offset: Int
    $orderBy: [AvatarSort]
    $filter: AvatarWhere
  ) {
    avatars(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      avatarId
      picture
      name
      coinPrice
    }
    avatarsAggregate(where: $filter) {
      count
    }
  }
`

const SET_AVATARS = gql`
  mutation setAvatars(
    $avatarId: ID!
    $picture: String
    $name: String
    $coinPrice: Int
  ) {
    updateAvatars(
      where: { avatarId: $avatarId }
      update: { picture: $picture, name: $name, coinPrice: $coinPrice }
    ) {
      avatars {
        avatarId
      }
    }
  }
`
const DELETE_AVATAR = gql`
  mutation DeleteAvatar($avatarId: ID!) {
    deleteAvatars(where: { avatarId: $avatarId }) {
      bookmark
    }
  }
`

const columns = [
  {
    id: 'picture',
    disablePadding: false,
    label: 'Avatar Picture',
    editable: true,
    required: true,
    type: FIELD_TYPES.PICTURE,
  },
  {
    id: 'name',
    disablePadding: false,
    label: 'Name',
    editable: true,
    required: true,
    left: '0',
    bottom: '4px',
  },
  {
    id: 'coinPrice',
    disablePadding: false,
    label: 'Coin Price',
    editable: true,
    required: true,
    numeric: true,
    type: FIELD_TYPES.NUMBER,
    left: '0',
    top: '0',
    additionalText: 'coins',
  },
]

const AvatarTable = ({
  noHeader = false,
  avatars = null,
  toggleCollection = false,
  doUpdate,
  updatedFields,
  collectionId = null,
  defaultValue = [],
  ...props
}) => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const filter = collectionId
    ? { collections: { avatarCollectionId: collectionId } }
    : null
  const { data, loading, error, refetch } = avatars
    ? {
        data: { avatars },
        loading: false,
        error: false,
        refetch: () => {
          return
        },
      }
    : useQuery(GET_AVATARS, {
        variables: {
          limit: defaultLimit,
          filter: filter,
        },
        onError(error) {
          console.log('get', error)
        },
      })
  const [deleteAvatar] = useMutation(DELETE_AVATAR, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Avatars
      noHeader={noHeader}
      columns={columns}
      createText={'Create new Avatar'}
      QUERY={CREATE_AVATAR}
      refetch={refetch}
      filter={filter}
      {...props}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <PictureTable
          tableName="Avatar"
          headCells={columns}
          rows={avatars || data.avatars}
          refetch={refetch}
          count={data?.avatarsAggregate?.count}
          limit={defaultLimit}
          canEdit={allowed.includes(superCurrentUser.rights) && !noHeader}
          QUERY={SET_AVATARS}
          deleteItem={deleteAvatar}
          id={'avatarId'}
          toggleCollection={toggleCollection}
          doUpdate={doUpdate}
          updatedFields={updatedFields}
          defaultValue={defaultValue}
        />
      )}
    </Avatars>
  )
}

export { columns }
export default AvatarTable
