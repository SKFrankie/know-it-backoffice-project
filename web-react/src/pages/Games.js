import React, { useContext } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import SectionButton from '../features/SectionButton'
import { Input } from '../ui/Form'
import { GAMES } from '../helpers/constants'
import Flex, { Column } from '../ui/Flex'
import { useQuery, gql, useMutation } from '@apollo/client'
import EditIcon from '@mui/icons-material/ModeEditOutlined'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { SuperUserContext } from '../context'
import Popover from '../ui/Popover'
import SearchBar from '../features/SearchBar'
import CreateNew from '../features/modals/CreateNew'
import { MenuButtons } from '../features/Header'

const GET_GAME = gql`
  query Games($name: GameName!) {
    games(where: { name: $name }) {
      name
      timer
    }
  }
`
const SET_GAME = gql`
  mutation UpdateGames($name: GameName!, $timer: Int) {
    updateGames(where: { name: $name }, update: { timer: $timer }) {
      games {
        timer
      }
    }
  }
`

const Games = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      {GAMES.map(({ icon, label, href }) => (
        <SectionButton
          sx={{ m: 5 }}
          Icon={icon}
          key={label}
          label={label}
          href={href}
        />
      ))}
    </Box>
  )
}

const Game = ({
  game,
  children,
  createText = 'modal missing',
  columns,
  refetch = () => {},
  empty = false,
  QUERY,
}) => {
  const [timer, setTimer] = React.useState(0)
  const [isEditing, setIsEditing] = React.useState(false)
  const superCurrentUser = useContext(SuperUserContext)

  const { data, loading, refetch: refetchTimer } = useQuery(GET_GAME, {
    variables: { name: game },
    onError: (e) => console.log('GET_GAME', e),
    onCompleted: (data) => {
      if (data.games.length > 0) {
        setTimer(data.games[0].timer)
      }
    },
  })
  const [setGame] = useMutation(SET_GAME, {
    onCompleted() {
      refetchTimer()
    },
    onError(error) {
      console.log('SET GAME', error)
    },
  })

  return (
    <Box>
      <Flex>
        <Column sx={{ flexGrow: 1 }}>
          <MenuButtons sections={GAMES} />
          {data && !loading && (
            <Flex>
              {!isEditing ? (
                <>
                  <Typography p={1} variant="h6" color="textSecondary">
                    Timer : {data.games[0]?.timer}s
                  </Typography>
                  {['ADMIN', 'EDITOR'].includes(superCurrentUser.rights) && (
                    <IconButton
                      aria-label="edit"
                      size="small"
                      onClick={() => setIsEditing(true)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </>
              ) : (
                <>
                  <Input
                    type="number"
                    onChange={(e) => {
                      setTimer(e.target.value)
                    }}
                    value={timer}
                  />
                  <Column>
                    <Popover text="Save changes">
                      <IconButton
                        aria-label="valid"
                        size="small"
                        sx={{ color: 'green' }}
                        onClick={() => {
                          setIsEditing(false)
                          setGame({
                            variables: { name: game, timer: parseInt(timer) },
                          })
                        }}
                      >
                        <DoneOutlinedIcon />
                      </IconButton>
                    </Popover>
                    <Popover text="Cancel changes">
                      <IconButton
                        aria-label="cancel"
                        size="small"
                        onClick={() => {
                          setIsEditing(false)
                        }}
                        sx={{ color: 'red' }}
                      >
                        <CloseOutlinedIcon />
                      </IconButton>
                    </Popover>
                  </Column>
                </>
              )}
            </Flex>
          )}
        </Column>
        {!empty && (
          <CreateNew
            name={createText}
            columns={columns}
            QUERY={QUERY}
            refetch={refetch}
          />
        )}
      </Flex>
      {!empty && (
        <Box>
          <SearchBar
            sx={{ flexGrow: 1 }}
            searchFields={columns}
            refetch={refetch}
          />
          {children}
        </Box>
      )}
    </Box>
  )
}

export { Game }
export default Games
