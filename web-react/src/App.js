import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from 'react-router-dom'

import { Box, Typography, Container, Link as MUILink } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Loading from './ui/Loading'
import Home from './pages/Home'
import Header from './features/Header'
import Login from './pages/Login'
import Users from './pages/Users'
import { SuperUserContext } from './context'
import Admin from './pages/Admin'
import Signup from './pages/SignUp'
import Games from './pages/Games'
import AntonymHunt from './pages/games/AntonymHunt'
import SynonymRoll from './pages/games/SynonymRoll'
import GrammarGeek from './pages/games/GrammarGeek'
import LetsTalk from './pages/games/LetsTalk'
import NumbersPlus from './pages/games/NumbersPlus'
import FabVocab from './pages/games/FabVocab'
import AvatarTable from './pages/Avatars/AvatarTable'
import AvatarCollectionTable from './pages/Avatars/AvatarCollectionTable'
import Gifts from './pages/Gifts'
import Knowlympics from './pages/games/Knowlympics'
import GrammarModuleTable from './pages/GrammarModuleTable'

const GET_CURRENT_USER = gql`
  query SuperCurrentUser {
    superCurrentUser {
      userId
      mail
      firstname
      lastname
      rights
    }
  }
`

const theme = createTheme({
  palette: {
    primary: {
      main: '#007EA7',
    },
    secondary: {
      main: '#7B9497',
    },
    text: {
      primary: '#007EA7',
      secondary: '#7B9497',
    },
  },
})

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <MUILink color="inherit" href="https://www.know-it.bluepopcorn.fun">
        BluePopcorn Production
      </MUILink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const PrivateRoute = ({ component: Component, currentUser, ...rest }) => {
  return (
    <Route {...rest}>
      {currentUser.online === false && currentUser.loading === false ? (
        <Redirect to="/login" />
      ) : (
        <Component />
      )}
    </Route>
  )
}

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    online: false,
    loading: true,
  })
  const { loading } = useQuery(GET_CURRENT_USER, {
    onError(err) {
      console.log('error', err)
      setCurrentUser({ online: false, loading: false })
    },
    onCompleted(res) {
      const online = res.superCurrentUser !== null
      setCurrentUser({ online, loading: false, ...res.superCurrentUser })
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <SuperUserContext.Provider value={currentUser}>
        <Router>
          <Header />
          {loading && <Loading />}
          {!loading && (
            <Container>
              <Switch>
                <Route path="/signup/:token">
                  {currentUser.online === false ? (
                    <Signup />
                  ) : (
                    <Redirect to="/" />
                  )}
                </Route>
                <Route exact path="/login">
                  {currentUser.online === false ? (
                    <Login />
                  ) : (
                    <Redirect to="/" />
                  )}
                </Route>

                <PrivateRoute
                  currentUser={currentUser}
                  component={Home}
                  exact
                  path="/"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={Users}
                  exact
                  path="/users"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={Admin}
                  exact
                  path="/admin"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={Games}
                  exact
                  path="/games"
                />

                <PrivateRoute
                  currentUser={currentUser}
                  component={AntonymHunt}
                  exact
                  path="/games/antonym-hunt"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={SynonymRoll}
                  exact
                  path="/games/synonym-roll"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={GrammarGeek}
                  exact
                  path="/games/grammar-geek"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={LetsTalk}
                  exact
                  path="/games/lets-talk"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={NumbersPlus}
                  exact
                  path="/games/numbers-plus"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={FabVocab}
                  exact
                  path="/games/fab-vocab"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={Knowlympics}
                  exact
                  path="/games/knowlympics"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={AvatarTable}
                  exact
                  path="/avatars"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={AvatarCollectionTable}
                  exact
                  path="/avatars-collections"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={GrammarModuleTable}
                  exact
                  path="/grammar-modules"
                />
                <PrivateRoute
                  currentUser={currentUser}
                  component={Gifts}
                  exact
                  path="/gifts"
                />
              </Switch>

              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          )}
        </Router>
      </SuperUserContext.Provider>
    </ThemeProvider>
  )
}
