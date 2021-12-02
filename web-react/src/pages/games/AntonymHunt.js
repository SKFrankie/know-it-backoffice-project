import React, { useContext } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../../ui/Loading'
import Table from '../../features/Table'
import { SuperUserContext } from '../../context'
import { Game } from '../Games'

const GET_ANTONYM_HUNT_ASSOCIATIONS = gql`
  query AntonymHuntAssociations(
    $limit: Int
    $offset: Int
    $orderBy: [AntonymHuntAssociationSort]
    $filter: AntonymHuntAssociationWhere
  ) {
    antonymHuntAssociations(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      antonymId
      rightWord
      leftWord
    }
    antonymHuntAssociationsAggregate(where: $filter) {
      count
    }
  }
`

const SET_ANTONYM_HUNT_ASSOCIATIONS = gql`
  mutation setAntonymHuntAssociations(
    $antonymId: ID!
    $rightWord: String
    $leftWord: String
  ) {
    updateAntonymHuntAssociations(
      where: { antonymId: $antonymId }
      update: { rightWord: $rightWord, leftWord: $leftWord }
    ) {
      antonymHuntAssociations {
        antonymId
        rightWord
        leftWord
      }
    }
  }
`

const DELETE_ANTONYM_HUNT_ASSOCIATIONS = gql`
  mutation DeleteAntonymHuntAssociations($antonymId: ID!) {
    deleteAntonymHuntAssociations(where: { antonymId: $antonymId }) {
      bookmark
    }
  }
`
const CREATE_ANTONYM_HUNT_ASSOCIATIONS = gql`
  mutation CreateAntonymHuntAssociations(
    $rightWord: String!
    $leftWord: String!
  ) {
    createAntonymHuntAssociations(
      input: { rightWord: $rightWord, leftWord: $leftWord }
    ) {
      antonymHuntAssociations {
        antonymId
      }
    }
  }
`

const AntonymHunt = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(
    GET_ANTONYM_HUNT_ASSOCIATIONS,
    {
      variables: {
        limit: defaultLimit,
      },
      onError(error) {
        console.log('get', error)
      },
    }
  )
  const [setAntonymHuntAssociations] = useMutation(
    SET_ANTONYM_HUNT_ASSOCIATIONS,
    {
      onCompleted() {
        refetch()
      },
      onError(error) {
        console.log(error)
      },
    }
  )
  const [deleteAntonymHuntAssociations] = useMutation(
    DELETE_ANTONYM_HUNT_ASSOCIATIONS,
    {
      onCompleted() {
        refetch()
      },
      onError(error) {
        console.log(error)
      },
    }
  )

  const columns = [
    {
      id: 'rightWord',
      numeric: false,
      disablePadding: false,
      label: 'Right word',
      editable: true,
      required: true,
    },
    {
      id: 'leftWord',
      numeric: false,
      disablePadding: false,
      label: 'Left word',
      editable: true,
      required: true,
    },
  ]

  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Game
      title="Antonym Hunt"
      game="ANTONYM_HUNT"
      columns={columns}
      refetch={refetch}
      createText="Create new Antonym Hunt Association"
      QUERY={CREATE_ANTONYM_HUNT_ASSOCIATIONS}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Antonym Hunt associations"
          headCells={columns}
          rows={data.antonymHuntAssociations}
          refetch={refetch}
          count={data.antonymHuntAssociationsAggregate.count}
          limit={defaultLimit}
          hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          setFields={setAntonymHuntAssociations}
          deleteItem={deleteAntonymHuntAssociations}
          id={'antonymId'}
        />
      )}
    </Game>
  )
}

export default AntonymHunt
