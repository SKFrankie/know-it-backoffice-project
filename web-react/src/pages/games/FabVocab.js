import React, { useContext } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Loading from '../../ui/Loading'
import Table from '../../features/Table'
import { SuperUserContext } from '../../context'
import { Game } from '../Games'
import { FIELD_TYPES } from '../../helpers/constants'

const GET_FAB_VOCAB_QUESTIONS = gql`
  query FabVocabQuestions(
    $limit: Int
    $offset: Int
    $orderBy: [FabVocabQuestionSort]
    $filter: FabVocabQuestionWhere
  ) {
    fabVocabQuestions(
      options: { limit: $limit, offset: $offset, sort: $orderBy }
      where: $filter
    ) {
      fabvocabId
      picture
      correctWords
      wrongWords
      correctSentence
      wrongSentences
    }
    fabVocabQuestionsAggregate(where: $filter) {
      count
    }
  }
`

const SET_FAB_VOCAB_QUESTIONS = gql`
  mutation setFabVocabQuestions(
    $fabvocabId: ID!
    $picture: String
    $correctWords: [String!]
    $wrongWords: [String!]
    $correctSentence: String
    $wrongSentences: [String!]
  ) {
    updateFabVocabQuestions(
      where: { fabvocabId: $fabvocabId }
      update: {
        picture: $picture
        correctWords: $correctWords
        wrongWords: $wrongWords
        correctSentence: $correctSentence
        wrongSentences: $wrongSentences
      }
    ) {
      fabVocabQuestions {
        fabvocabId
      }
    }
  }
`

const DELETE_FAB_VOCAB_QUESTIONS = gql`
  mutation DeleteFabVocabQuestions($fabvocabId: ID!) {
    deleteFabVocabQuestions(where: { fabvocabId: $fabvocabId }) {
      bookmark
    }
  }
`
const CREATE_FAB_VOCAB_QUESTIONS = gql`
  mutation CreateFabVocabQuestions(
    $picture: String!
    $correctWords: [String!]!
    $wrongWords: [String!]!
    $correctSentence: String!
    $wrongSentences: [String!]!
  ) {
    createFabVocabQuestions(
      input: {
        picture: $picture
        correctWords: $correctWords
        wrongWords: $wrongWords
        correctSentence: $correctSentence
        wrongSentences: $wrongSentences
      }
    ) {
      fabVocabQuestions {
        fabvocabId
      }
    }
  }
`

const FabVocab = () => {
  const superCurrentUser = useContext(SuperUserContext)
  const defaultLimit = 50
  const { data, loading, error, refetch } = useQuery(GET_FAB_VOCAB_QUESTIONS, {
    variables: {
      limit: defaultLimit,
    },
    onError(error) {
      console.log('get', error)
    },
  })
  const [setFabVocabQuestions] = useMutation(SET_FAB_VOCAB_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })
  const [deleteFabVocabQuestions] = useMutation(DELETE_FAB_VOCAB_QUESTIONS, {
    onCompleted() {
      refetch()
    },
    onError(error) {
      console.log(error)
    },
  })

  const columns = [
    {
      id: 'picture',
      disablePadding: false,
      label: 'Picture',
      editable: true,
      required: true,
      type: FIELD_TYPES.PICTURE,
    },
    {
      id: 'correctSentence',
      disablePadding: false,
      label: 'Correct Sentence',
      editable: true,
      required: true,
    },
    {
      id: 'correctWords',
      disablePadding: false,
      label: 'Correct Words',
      editable: true,
      required: true,
      type: FIELD_TYPES.ARRAY,
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
      id: 'wrongSentences',
      disablePadding: false,
      label: 'Wrong Sentences',
      editable: true,
      required: true,
      type: FIELD_TYPES.ARRAY,
    },
  ]

  const allowed = ['ADMIN', 'EDITOR']
  return (
    <Game
      title="Fab Vocab"
      game="FAB_VOCAB"
      columns={columns}
      refetch={refetch}
      createText="Create new Fab Vocab question"
      QUERY={CREATE_FAB_VOCAB_QUESTIONS}
    >
      {loading && <Loading />} {error && 'error'}
      {data && (
        <Table
          tableName="Fab Vocab questions"
          headCells={columns}
          rows={data.fabVocabQuestions}
          refetch={refetch}
          count={data.fabVocabQuestionsAggregate.count}
          limit={defaultLimit}
          hasCheckbox={allowed.includes(superCurrentUser.rights)}
          canEdit={allowed.includes(superCurrentUser.rights)}
          setFields={setFabVocabQuestions}
          deleteItem={deleteFabVocabQuestions}
          id={'fabvocabId'}
        />
      )}
    </Game>
  )
}

export default FabVocab
