import React, { useContext, useMemo } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../../ui/Loading'
import Table from '../../features/Table'
import { SuperUserContext } from '../../context'
import { Game } from '../Games'
import { FIELD_TYPES } from '../../helpers/constants'

const GET_GRAMMAR_MODULES = gql`
  query GrammarModules {
    grammarModules {
      grammarModuleId
      name
    }
  }
`

const GET_GRAMMAR_GEEK_QUESTIONS = gql`
  query GrammarGeekQuestions(
    $limit: Int
    $offset: Int
    $filter: GrammarGeekQuestionWhere
    $orderBy: [GrammarGeekQuestionSort]
  ) {
    grammarGeekQuestions(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      grammarId
      sentence
      correctWord
      wrongWords
      hint
      modules {
        name
      }
    }
    grammarGeekQuestionsAggregate(where: $filter) {
      count
    }
  }
`

const SET_GRAMMAR_GEEK_QUESTIONS = gql`
  mutation setGrammarGeekQuestions(
    $grammarId: ID!
    $sentence: String
    $correctWord: String
    $wrongWords: [String!]
    $hint: String
    $modules: [GrammarModule]
  ) {
    updateGrammarGeekQuestions(
      where: { grammarId: $grammarId }
      update: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
        hint: $hint
        modules: $modules
      }
    ) {
      grammarGeekQuestions {
        grammarId
      }
    }
  }
`

const DELETE_GRAMMAR_GEEK_QUESTIONS = gql`
  mutation DeleteGrammarGeekQuestions($grammarId: ID!) {
    deleteGrammarGeekQuestions(where: { grammarId: $grammarId }) {
      bookmark
    }
  }
`
const CREATE_GRAMMAR_GEEK_QUESTIONS = gql`
  mutation CreateGrammarGeekQuestions(
    $correctWord: String!
    $sentence: String!
    $wrongWords: [String!]!
    $hint: String
    $modules: [GrammarModule]
  ) {
    createGrammarGeekQuestions(
      input: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
        hint: $hint
        modules: $modules
      }
    ) {
      grammarGeekQuestions {
        grammarId
      }
    }
  }
`

const GrammarGeek = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data: grammarModules } = useQuery(GET_GRAMMAR_MODULES, {
    onError(error) {
      console.log('get', error)
    },
  })
  const { data, loading, error, refetch } = useQuery(
    GET_GRAMMAR_GEEK_QUESTIONS,
    {
      variables: {
        limit: defaultLimit,
      },
      onError(error) {
        console.log('get', error)
      },
    }
  )
  const [setGrammarGeekQuestions] = useMutation(SET_GRAMMAR_GEEK_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [deleteGrammarGeekQuestions] = useMutation(
    DELETE_GRAMMAR_GEEK_QUESTIONS,
    {
      onCompleted() {
        refetch()
      },
      onError(error) {
        console.log(error)
      },
    }
  )

  const columns = useMemo(
    () => [
      {
        id: 'sentence',
        disablePadding: false,
        label: 'Sentence',
        editable: true,
        required: true,
      },
      {
        id: 'correctWord',
        disablePadding: false,
        label: 'Correct Word',
        editable: true,
        required: true,
      },
      {
        id: 'wrongWords',
        disablePadding: false,
        label: 'Wrong words',
        editable: true,
        required: true,
        type: FIELD_TYPES.ARRAY,
      },
      {
        id: 'hint',
        disablePadding: false,
        label: 'Hint',
        editable: true,
        required: false,
      },
      {
        id: 'modules',
        disablePadding: false,
        label: 'Modules',
        editable: true,
        required: false,
        type: FIELD_TYPES.AUTOCOMPLETE_MULTIPLE,
        options:
          grammarModules?.grammarModules.map((module) => ({
            label: module.name,
            value: module.grammarModuleId,
          })) || [],
      },
    ],
    [grammarModules]
  )

  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Game
      title="Grammar Geek"
      game="GRAMMAR_GEEK"
      columns={columns}
      refetch={refetch}
      createText="Create new grammar geek question"
      QUERY={CREATE_GRAMMAR_GEEK_QUESTIONS}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Grammar Geek questions"
          headCells={columns}
          rows={data.grammarGeekQuestions}
          refetch={refetch}
          count={data.grammarGeekQuestionsAggregate.count}
          limit={defaultLimit}
          hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          setFields={setGrammarGeekQuestions}
          deleteItem={deleteGrammarGeekQuestions}
          id={'grammarId'}
        />
      )}
    </Game>
  )
}

export default GrammarGeek
