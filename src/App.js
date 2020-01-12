import React from 'react';
import './App.css';
import { Navbar, NavItem } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import NotePage from './pages/NotePage';
import NotesPage from './pages/NotesPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <Navbar bg="light" expand="sm">
            <NavItem><Link to="/login">Login</Link></NavItem>
            <NavItem><Link to="/notes">Notes</Link></NavItem>
            <NavItem><Link to="/">Write</Link></NavItem>
          </Navbar>
        </header>
        <body>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/notes">
              <NotesPage />
            </Route>
            <Route path="/">
              <NotePage />
            </Route>
          </Switch>
        </body>
      </div>

    </Router>
  );
}

export default App;
