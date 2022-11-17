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

const ADD_MODULES_TO_NUMBERS_PLUS = gql`
  mutation AddModulesToNumbersPlus($numbersPlusId: ID!, $moduleIds: [ID]) {
    addModulesToNumbersPlus(
      numbersPlusId: $numbersPlusId
      moduleIds: $moduleIds
    ) {
      numbersPlusId
    }
  }
`

const GET_NUMBERS_PLUS_QUESTIONS = gql`
  query NumbersPlusQuestions(
    $limit: Int
    $offset: Int
    $filter: NumbersPlusQuestionWhere
    $orderBy: [NumbersPlusQuestionSort]
  ) {
    numbersPlusQuestions(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      numbersPlusId
      sentence
      correctWord
      wrongWords
      modules {
        name
        grammarModuleId
      }
    }
    numbersPlusQuestionsAggregate(where: $filter) {
      count
    }
  }
`

const SET_NUMBERS_PLUS_QUESTIONS = gql`
  mutation setNumbersPlusQuestions(
    $numbersPlusId: ID!
    $sentence: String
    $correctWord: String
    $wrongWords: [String!]
  ) {
    updateNumbersPlusQuestions(
      where: { numbersPlusId: $numbersPlusId }
      update: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
      }
    ) {
      numbersPlusQuestions {
        numbersPlusId
      }
    }
  }
`

const SET_NUMBERS_PLUS_QUESTIONS_MODULES = gql`
  mutation setNumbersPlusQuestions($numbersPlusId: ID!, $moduleIds: [ID]) {
    addModulesToNumbersPlus(
      numbersPlusId: $numbersPlusId
      moduleIds: $moduleIds
    ) {
      numbersPlusId
      modules {
        name
      }
    }
  }
`

const DELETE_NUMBERS_PLUS_QUESTIONS = gql`
  mutation DeleteNumbersPlusQuestions($numbersPlusId: ID!) {
    deleteNumbersPlusQuestions(where: { numbersPlusId: $numbersPlusId }) {
      bookmark
    }
  }
`
const CREATE_NUMBERS_PLUS_QUESTIONS = gql`
  mutation CreateNumbersPlusQuestions(
    $correctWord: String!
    $sentence: String!
    $wrongWords: [String!]!
  ) {
    createNumbersPlusQuestions(
      input: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
      }
    ) {
      numbersPlusQuestions {
        numbersPlusId
      }
    }
  }
`

const NumbersPlus = () => {
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
    GET_NUMBERS_PLUS_QUESTIONS,
    {
      variables: {
        limit: defaultLimit,
      },
      onError(error) {
        console.log('get', error)
      },
    }
  )
  const [setNumbersPlusQuestions] = useMutation(SET_NUMBERS_PLUS_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })

  const [setNumbersPlusQuestionsModules] = useMutation(
    SET_NUMBERS_PLUS_QUESTIONS_MODULES,
    {
      onCompleted() {
        refetch()
      },
      onError(error) {
        console.log(error)
      },
    }
  )

  const setNumbersPlusQuestionsCustom = async ({ variables }) => {
    const { modules, ...updatedVariables } = variables
    const moduleIds = modules?.map((module) => module.value)
    setNumbersPlusQuestions({ variables: { ...updatedVariables } })

    if (moduleIds) {
      setNumbersPlusQuestionsModules({
        variables: { numbersPlusId: updatedVariables.numbersPlusId, moduleIds },
      })
    }
  }
  const [deleteNumbersPlusQuestions] = useMutation(
    DELETE_NUMBERS_PLUS_QUESTIONS,
    {
      onCompleted() {
        refetch()
      },
      onError(error) {
        console.log(error)
      },
    }
  )

  const [createNew] = useMutation(CREATE_NUMBERS_PLUS_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [addModules] = useMutation(ADD_MODULES_TO_NUMBERS_PLUS, {
    onError(error) {
      console.log('add modules to 3-2-1 Go error', error)
    },
  })
  const createMutation = async (variables, onCompleted, setError) => {
    const { sentence, correctWord, wrongWords, modules } = variables
    const moduleIds = modules?.map((module) => module.value) || []
    const createNewResponse = await createNew({
      variables: { sentence, correctWord, wrongWords },
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

    const { numbersPlusId: numbersPlusId } =
      createNewResponse.data.createNumbersPlusQuestions.numbersPlusQuestions[0]
    const addModulesToNumbersPlus = await addModules({
      variables: { numbersPlusId, moduleIds: moduleIds || [] },
      onComplete() {
        refetchGrammarModules()
      },
      onError(error) {
        console.log(error)
      },
    })
    if (addModulesToNumbersPlus?.data) {
      onCompleted(addModulesToNumbersPlus.data)
    } else {
      setError(
        '3-2-1 Go question has been created but something went wrong with the modules'
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
      title="3-2-1 Go"
      game="NUMBERS_PLUS"
      columns={columns}
      refetch={refetch}
      createText="Create new 3-2-1 Go question"
      // QUERY={CREATE_NUMBERS_PLUS_QUESTIONS}
      customMutation={createMutation}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="3-2-1 Go questions"
          headCells={columns}
          rows={data.numbersPlusQuestions}
          refetch={refetch}
          count={data.numbersPlusQuestionsAggregate.count}
          limit={defaultLimit}
          hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          setFields={setNumbersPlusQuestionsCustom}
          deleteItem={deleteNumbersPlusQuestions}
          id={'numbersPlusId'}
        />
      )}
    </Game>
  )
}

export default NumbersPlus
