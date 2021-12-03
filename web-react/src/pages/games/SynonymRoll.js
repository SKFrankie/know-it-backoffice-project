import React, { useContext } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../../ui/Loading'
import Table from '../../features/Table'
import { SuperUserContext } from '../../context'
import { Game } from '../Games'
import { FIELD_TYPES } from '../../helpers/constants'

const GET_SYNONYM_ROLL_LISTS = gql`
  query SynonymRollLists(
    $limit: Int
    $offset: Int
    $orderBy: [SynonymRollListSort]
    $filter: SynonymRollListWhere
  ) {
    synonymRollLists(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      synonymId
      synonyms
    }
    synonymRollListsAggregate(where: $filter) {
      count
    }
  }
`

const SET_SYNONYM_ROLL_LISTS = gql`
  mutation setSynonymRollLists($synonymId: ID!, $synonyms: [String!]) {
    updateSynonymRollLists(
      where: { synonymId: $synonymId }
      update: { synonyms: $synonyms }
    ) {
      synonymRollLists {
        synonymId
        synonyms
      }
    }
  }
`

const DELETE_SYNONYM_ROLL_LISTS = gql`
  mutation DeleteSynonymRollLists($synonymId: ID!) {
    deleteSynonymRollLists(where: { synonymId: $synonymId }) {
      bookmark
    }
  }
`
const CREATE_SYNONYM_ROLL_LISTS = gql`
  mutation CreateSynonymRollLists($rightWord: String!, $leftWord: String!) {
    createSynonymRollLists(
      input: { rightWord: $rightWord, leftWord: $leftWord }
    ) {
      synonymRollLists {
        synonymId
      }
    }
  }
`

const SynonymRoll = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_SYNONYM_ROLL_LISTS, {
    variables: {
      limit: defaultLimit,
    },
    onError(error) {
      console.log('get', error)
    },
  })
  const [setSynonymRollLists] = useMutation(SET_SYNONYM_ROLL_LISTS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [deleteSynonymRollLists] = useMutation(DELETE_SYNONYM_ROLL_LISTS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })

  const columns = [
    {
      id: 'synonyms',
      numeric: false,
      disablePadding: false,
      label: 'Synonym lists',
      editable: true,
      required: true,
      type: FIELD_TYPES.ARRAY,
    },
  ]

  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Game
      title="Synonym roll"
      game="SYNONYM_ROLL"
      columns={columns}
      refetch={refetch}
      createText="Create new Synonym list"
      QUERY={CREATE_SYNONYM_ROLL_LISTS}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Synonym Roll Lists"
          headCells={columns}
          rows={data.synonymRollLists}
          refetch={refetch}
          count={data.synonymRollListsAggregate.count}
          limit={defaultLimit}
          hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          setFields={setSynonymRollLists}
          deleteItem={deleteSynonymRollLists}
          id={'synonymId'}
        />
      )}
    </Game>
  )
}

export default SynonymRoll
