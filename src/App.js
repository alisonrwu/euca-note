import React from "react";
import "./App.css";
import { Nav, Navbar } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import NotePage from "./pages/NotePage";
import NotesPage from "./pages/NotesPage";
import LoginPage from "./pages/LoginPage";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { IconContext } from "react-icons";
import { FiEdit2 } from "react-icons/fi";
import { MdPersonOutline } from "react-icons/md";
import { FaRegListAlt } from "react-icons/fa";

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
    this.state = {
      notes: [],
      notesMapping: {}
    };
    this.setupNotes = this.setupNotes.bind(this);
    this.loadNotes = this.loadNotes.bind(this);
  }

  loadNotes() {
    console.log("Loading all notes...");
    let self = this;
    let user = firebase.default.auth().currentUser;
    if (user != null) {
      let uid = user.uid;
      firebase.default.database().ref('/users/'+uid+'/notes')
        .orderByKey().once("value", function(data) {
        console.log(JSON.stringify(data));
        console.log(data.val());
        self.setState({
          notes: (data === null || data.val() === null) ? [] : Object.values(data.val())
        });
        console.log(self.state.notes);
      });
    }
  }

  setupNotes() {
    console.log("Set event listeners for notes...");
    let user = firebase.default.auth().currentUser;
    if (user != null) {
      let uid = user.uid;
      let notesRef = firebase.default.database().ref('/users/'+uid+'/notes');
      let self = this;
      notesRef.on('child_added', function(data) {
        // addNoteElement(data.key, data.val().text);
        self.state.notes.push(data);
        // this.state.userNotesMapping
        console.log("child_added");
      });

      notesRef.on('child_changed', function(data) {
        // setNoteValues(postElement, data.key, data.val().text;
        console.log("child_changed");
      });
      
      notesRef.on('child_removed', function(data) {
        // deleteNote(postElement, data.key);
        console.log("child_removed");
      });
    }
  }

  componentDidMount() {
    let self = this;
    firebase.default.auth().onAuthStateChanged(function(user) {
      self.setState({authenticated: user});
      if (user) {
        self.setupNotes();
        self.loadNotes();
      }
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar bg="light" expand="lg">
            {!this.state.authenticated && <IconContext.Provider value={{ size: "1.7em", className: "global-class-name" }}>
            <Nav.Link href="/login"><MdPersonOutline/></Nav.Link>
            </IconContext.Provider>}
            {this.state.authenticated && <IconContext.Provider value={{ size: "1.4em", className: "global-class-name" }}>
            <Nav.Link href="/notes"><FaRegListAlt/></Nav.Link>
            </IconContext.Provider>}
            <IconContext.Provider value={{ size: "1.4em", className: "global-class-name" }}>
            <Nav.Link href="/"><FiEdit2/></Nav.Link>
            </IconContext.Provider>
          </Navbar>
          <body className="Switch">
            <Switch>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path="/notes">
                <NotesPage notes={this.state.notes} />
              </Route>
              <Route path="/:noteId?">
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
