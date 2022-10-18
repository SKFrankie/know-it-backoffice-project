import React, { useContext, useMemo } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../../ui/Loading'
import Table from '../../features/Table'
import { SuperUserContext } from '../../context'
import { Game } from '../Games'
import { FIELD_TYPES, NUMBERS_PLUS_TYPES } from '../../helpers/constants'

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
      type
      sentence
      correctWord
      wrongWords
    }
    numbersPlusQuestionsAggregate(where: $filter) {
      count
    }
  }
`

const SET_NUMBERS_PLUS_QUESTIONS = gql`
  mutation setNumbersPlusQuestions(
    $numbersPlusId: ID!
    $type: String
    $sentence: String
    $correctWord: String
    $wrongWords: [String!]
  ) {
    updateNumbersPlusQuestions(
      where: { numbersPlusId: $numbersPlusId }
      update: {
        type: $type
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
    $type: String
    $sentence: String!
    $wrongWords: [String!]!
  ) {
    createNumbersPlusQuestions(
      input: {
        type: $type
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

  const setNumbersPlusQuestionsCustom = async ({ variables }) => {
    const { ...updatedVariables } = variables
    setNumbersPlusQuestions({ variables: { ...updatedVariables } })
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
  const createMutation = async (variables, onCompleted, setError) => {
    const { sentence, correctWord, wrongWords, type } = variables
    const createNewResponse = await createNew({
      variables: { sentence, correctWord, wrongWords, type },
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
  }

  const columns = useMemo(
    () => [
      {
        id: 'type',
        disablePadding: false,
        label: 'Type',
        selectValues: NUMBERS_PLUS_TYPES,
        editable: true,
        required: true,
        type: FIELD_TYPES.SELECT,
        placeholder: 'test',
      },
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
        label: 'Correct Sentence',
        editable: true,
        required: true,
      },
      {
        id: 'wrongWords',
        disablePadding: false,
        label: 'Wrong Sentences',
        editable: true,
        required: true,
        type: FIELD_TYPES.ARRAY,
      },
    ],
    []
  )

  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Game
      title="Numbers+"
      game="NUMBERS_PLUS"
      columns={columns}
      refetch={refetch}
      createText="Create new Numbers+ question"
      // QUERY={CREATE_NUMBERS_PLUS_QUESTIONS}
      customMutation={createMutation}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Numbers+ questions"
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
