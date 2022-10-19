import React, { useContext, useMemo } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../../ui/Loading'
import Table from '../../features/Table'
import { SuperUserContext } from '../../context'
import { Game } from '../Games'
import { FIELD_TYPES } from '../../helpers/constants'

const GET_LETS_TALK_QUESTIONS = gql`
  query LetsTalkQuestions(
    $limit: Int
    $offset: Int
    $filter: LetsTalkQuestionWhere
    $orderBy: [LetsTalkQuestionSort]
  ) {
    letsTalkQuestions(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      letsTalkId
      sentence
      correctWord
      wrongWords
    }
    letsTalkQuestionsAggregate(where: $filter) {
      count
    }
  }
`

const SET_LETS_TALK_QUESTIONS = gql`
  mutation setLetsTalkQuestions(
    $letsTalkId: ID!
    $sentence: String
    $correctWord: String
    $wrongWords: [String!]
  ) {
    updateLetsTalkQuestions(
      where: { letsTalkId: $letsTalkId }
      update: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
      }
    ) {
      letsTalkQuestions {
        letsTalkId
      }
    }
  }
`

const DELETE_LETS_TALK_QUESTIONS = gql`
  mutation DeleteLetsTalkQuestions($letsTalkId: ID!) {
    deleteLetsTalkQuestions(where: { letsTalkId: $letsTalkId }) {
      bookmark
    }
  }
`
const CREATE_LETS_TALK_QUESTIONS = gql`
  mutation CreateLetsTalkQuestions(
    $correctWord: String!
    $sentence: String!
    $wrongWords: [String!]!
  ) {
    createLetsTalkQuestions(
      input: {
        sentence: $sentence
        correctWord: $correctWord
        wrongWords: $wrongWords
      }
    ) {
      letsTalkQuestions {
        letsTalkId
      }
    }
  }
`

const LetsTalk = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_LETS_TALK_QUESTIONS, {
    variables: {
      limit: defaultLimit,
    },
    onError(error) {
      console.log('get', error)
    },
  })
  const [setLetsTalkQuestions] = useMutation(SET_LETS_TALK_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })

  const setLetsTalkQuestionsCustom = async ({ variables }) => {
    const { ...updatedVariables } = variables
    setLetsTalkQuestions({ variables: { ...updatedVariables } })
  }
  const [deleteLetsTalkQuestions] = useMutation(DELETE_LETS_TALK_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })

  const [createNew] = useMutation(CREATE_LETS_TALK_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const createMutation = async (variables, onCompleted, setError) => {
    const { sentence, correctWord, wrongWords } = variables
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
      title="Let's Talk"
      game="LETS_TALK"
      columns={columns}
      refetch={refetch}
      createText="Create new Let's Talk question"
      // QUERY={CREATE_LETS_TALK_QUESTIONS}
      customMutation={createMutation}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Let's Talk questions"
          headCells={columns}
          rows={data.letsTalkQuestions}
          refetch={refetch}
          count={data.letsTalkQuestionsAggregate.count}
          limit={defaultLimit}
          hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          setFields={setLetsTalkQuestionsCustom}
          deleteItem={deleteLetsTalkQuestions}
          id={'letsTalkId'}
        />
      )}
    </Game>
  )
}

export default LetsTalk
