import React, { useContext } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../ui/Loading'
import Table from '../features/Table'
import { SuperUserContext } from '../context'
import { FIELD_TYPES } from '../helpers/constants'
import SearchBar from '../features/SearchBar'
import { Box } from '@mui/material'
import CreateNew from '../features/modals/CreateNew'

const GET_GRAMMAR_MODULES = gql`
  query GrammarModules(
    $limit: Int
    $offset: Int
    $filter: GrammarModuleWhere
    $orderBy: [GrammarModuleSort]
  ) {
    grammarModules(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      grammarModuleId
      name
      text
    }
    grammarModulesAggregate(where: $filter) {
      count
    }
  }
`

const SET_GRAMMAR_MODULES = gql`
  mutation setGrammarModules(
    $grammarModuleId: ID!
    $name: String
    $text: String
  ) {
    updateGrammarModules(
      where: { grammarModuleId: $grammarModuleId }
      update: { name: $name, text: $text }
    ) {
      grammarModules {
        grammarModuleId
      }
    }
  }
`

const DELETE_GRAMMAR_MODULES = gql`
  mutation DeleteGrammarModules($grammarModuleId: ID!) {
    deleteGrammarModules(where: { grammarModuleId: $grammarModuleId }) {
      bookmark
    }
  }
`
const CREATE_GRAMMAR_MODULES = gql`
  mutation CreateGrammarModules($name: String!, $text: String) {
    createGrammarModules(input: { name: $name, text: $text }) {
      grammarModules {
        grammarModuleId
      }
    }
  }
`

const GrammarModule = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_GRAMMAR_MODULES, {
    variables: {
      limit: defaultLimit,
    },
    onError(error) {
      console.log('get', error)
    },
  })
  const [setGrammarModules] = useMutation(SET_GRAMMAR_MODULES, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [deleteGrammarModules] = useMutation(DELETE_GRAMMAR_MODULES, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })

  const columns = [
    {
      id: 'name',
      disablePadding: false,
      label: 'Name',
      editable: true,
      required: true,
    },
    {
      id: 'text',
      disablePadding: false,
      label: 'Text',
      editable: true,
      required: false,
      type: FIELD_TYPES.MULTILINE,
    },
  ]

  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Box>
      <Box textAlign="right">
        <CreateNew
          name={'Create new grammar module'}
          columns={columns}
          QUERY={CREATE_GRAMMAR_MODULES}
          refetch={refetch}
        />
      </Box>
      <SearchBar searchFields={columns} refetch={refetch} />
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Grammar Module"
          headCells={columns}
          rows={data.grammarModules}
          refetch={refetch}
          count={data.grammarModulesAggregate.count}
          limit={defaultLimit}
          hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          setFields={setGrammarModules}
          deleteItem={deleteGrammarModules}
          id={'grammarModuleId'}
        />
      )}
    </Box>
  )
}

export default GrammarModule
