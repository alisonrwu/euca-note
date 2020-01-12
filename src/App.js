import React from "react";
import "./App.css";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import NotePage from "./pages/NotePage";
import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";

import * as firebase from "firebase/app";
import { IconContext } from "react-icons";
import { FiEdit2 } from 'react-icons/fi';
import { MdPersonOutline } from 'react-icons/md';
import { FaRegListAlt } from 'react-icons/fa';

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

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar bg="light" expand="lg">
            <IconContext.Provider value={{ size: "1.7em", className: "global-class-name" }}>
            <Nav.Link href="/login"><MdPersonOutline/></Nav.Link>
            </IconContext.Provider>
            <IconContext.Provider value={{ size: "1.4em", className: "global-class-name" }}>
            <Nav.Link href="/notes"><FaRegListAlt/></Nav.Link>
            </IconContext.Provider>
            <IconContext.Provider value={{ size: "1.4em", className: "global-class-name" }}>
            <Nav.Link href="/"><FiEdit2/></Nav.Link>
            </IconContext.Provider>
          </Navbar>
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
}

export default App;
