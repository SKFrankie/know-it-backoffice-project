import React, { useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import { Box, Typography, Container, Link as MUILink } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Home from './pages/Home'
import Header from './features/Header'
import Login from './pages/Login'
import { SuperUserContext } from './context'

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

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  useQuery(GET_CURRENT_USER, {
    onError(err) {
      console.log('error', err)
    },
    onCompleted(res) {
      console.log('sucess', res)
      setCurrentUser(res.superCurrentUser)
    },
  })
  return (
    <ThemeProvider theme={theme}>
      <SuperUserContext.Provider value={currentUser}>
        <Router>
          <Header />
          <Container>
            <Switch>
              {/* <Route exact path="/" component={Dashboard} />
              <Route exact path="/businesses" component={UserList} />
              <Route exact path="/users" component={UserList} /> */}
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
            </Switch>

            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </Router>
      </SuperUserContext.Provider>
    </ThemeProvider>
  )
}
