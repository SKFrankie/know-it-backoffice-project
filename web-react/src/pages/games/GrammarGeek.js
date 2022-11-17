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

const ADD_MODULES_TO_GRAMMAR_GEEK = gql`
  mutation AddModulesToGrammarGeek($grammarGeekId: ID!, $moduleIds: [ID]) {
    addModulesToGrammarGeek(
      grammarGeekId: $grammarGeekId
      moduleIds: $moduleIds
    ) {
      grammarId
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
        grammarModuleId
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
  ) {
    updateGrammarGeekQuestions(
      where: { grammarId: $grammarId }
      update: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
        hint: $hint
      }
    ) {
      grammarGeekQuestions {
        grammarId
      }
    }
  }
`

const SET_GRAMMAR_GEEK_QUESTIONS_MODULES = gql`
  mutation setGrammarGeekQuestionsModules($grammarId: ID!, $moduleIds: [ID]) {
    addModulesToGrammarGeek(grammarGeekId: $grammarId, moduleIds: $moduleIds) {
      grammarId
      modules {
        name
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
  ) {
    createGrammarGeekQuestions(
      input: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
        hint: $hint
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
  const { data: grammarModules, refetch: refetchGrammarModules } = useQuery(
    GET_GRAMMAR_MODULES,
    {
      onError(error) {
        console.log('get', error)
      },
    }
  )
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

  const [setGrammarGeekQuestionsModules] = useMutation(
    SET_GRAMMAR_GEEK_QUESTIONS_MODULES,
    {
      onCompleted() {
        refetch()
      },
      onError(error) {
        console.log(error)
      },
    }
  )

  const setGrammarGeekQuestionsCustom = async ({ variables }) => {
    const { modules, ...updatedVariables } = variables
    const moduleIds = modules?.map((module) => module.value)

    setGrammarGeekQuestions({ variables: { ...updatedVariables } })
    if (moduleIds) {
      setGrammarGeekQuestionsModules({
        variables: { grammarId: updatedVariables.grammarId, moduleIds },
      })
    }
  }
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

  const [createNew] = useMutation(CREATE_GRAMMAR_GEEK_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [addModules] = useMutation(ADD_MODULES_TO_GRAMMAR_GEEK, {
    onError(error) {
      console.log('add modules to grammar geek error', error)
    },
  })
  const createMutation = async (variables, onCompleted, setError) => {
    const { sentence, correctWord, wrongWords, hint, modules } = variables
    const moduleIds = modules?.map((module) => module.value) || []
    const createNewResponse = await createNew({
      variables: { sentence, correctWord, wrongWords, hint },
      onError(error) {
        console.log(error)
      },
    })
    if (createNewResponse?.data) {
      onCompleted(createNewResponse.data)
    } else {
      setError('Error, please try again')
      return
    }

    const { grammarId: grammarGeekId } =
      createNewResponse.data.createGrammarGeekQuestions.grammarGeekQuestions[0]
    const addModulesToGrammarGeek = await addModules({
      variables: { grammarGeekId, moduleIds: moduleIds || [] },
      onComplete() {
        refetchGrammarModules()
      },
      onError(error) {
        console.log(error)
      },
    })
    if (addModulesToGrammarGeek?.data) {
      onCompleted(addModulesToGrammarGeek.data)
    } else {
      setError(
        'Grammar Geek question has been created but something went wrong with the modules'
      )
    }
  }

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
        valuesCallback: (values, options) => {
          const mappedValues =
            values?.map((module) => module.grammarModuleId) || []
          const newValues = options.filter((option) =>
            mappedValues.includes(option.value)
          )
          return newValues
        },
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
      // QUERY={CREATE_GRAMMAR_GEEK_QUESTIONS}
      customMutation={createMutation}
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
          setFields={setGrammarGeekQuestionsCustom}
          deleteItem={deleteGrammarGeekQuestions}
          id={'grammarId'}
        />
      )}
    </Game>
  )
}

export default GrammarGeek
