import React from 'react'

import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import {
  Box,
  Typography,
  Container,
  Link as MUILink,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core'
import Home from './pages/Home'
import Header from './features/Header'

const theme = createMuiTheme({
  palette: {
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
      <MUILink color="inherit" href="https://grandstack.io/">
        BluePopcorn Production
      </MUILink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Header />
        <Container>
          <Switch>
            {/* <Route exact path="/" component={Dashboard} />
              <Route exact path="/businesses" component={UserList} />
              <Route exact path="/users" component={UserList} /> */}
            <Route exact path="/" component={Home} />
          </Switch>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </Router>
    </MuiThemeProvider>
  )
}
