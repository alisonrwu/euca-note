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

import * as firebase from "firebase/app";

// Set up firebase
const firebaseConfig = {
  apiKey: "AIzaSyBz2XEj5EQ2k2H-BKCom-IHqmVSHeVXKNE",
  authDomain: "euca-e7797.firebaseapp.com",
  databaseURL: "https://euca-e7797.firebaseio.com",
  projectId: "euca-e7797",
  storageBucket: "euca-e7797.appspot.com",
  messagingSenderId: "158884482446",
  appId: "1:158884482446:web:ce4fe9acc745275698a8df",
  measurementId: "G-VFF06608V9"
};

// Initialize Firebase
firebase.default.initializeApp(firebaseConfig);

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
