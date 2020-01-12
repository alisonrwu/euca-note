import React from 'react';
import logo from './logo.svg';
import './App.css';

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
        <nav>
          <ul>
            <li>
              <Link to="/notes">Notes</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
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
