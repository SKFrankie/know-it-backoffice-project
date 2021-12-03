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
