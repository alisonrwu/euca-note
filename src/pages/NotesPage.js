import React from 'react';
import { withRouter } from "react-router-dom";

import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

class NotesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notes: [] };
    this.loadNotes = this.loadNotes.bind(this);
  }

  loadNotes() {
    console.log("Reading");
    let self = this;
    let user = firebase.default.auth().currentUser;
    if (user != null) {
      let uid = user.uid;
      firebase.default.database().ref('/users/'+uid+'/notes').once("value", function(data) {
        console.log(JSON.stringify(data));
        self.setState({
          notes: (data == null || data.val() == null) ? [] : Object.values(data.val())
        });
        console.log(self.state.notes);
      });
    }
  }

  writeUserData() {
    console.log("Writing");
    let user = firebase.default.auth().currentUser;

    if (user != null) {
      let uid = user.uid;
      let data = ["hello", "bello", "mello"];
      data.forEach(n => {
        firebase.default.database().ref('/users/'+uid+'/notes').push({
          title: n,
          body: n,
          timestamp: Date.now(),
          uuid: generateUUID(),
      });
      })
    }
  }

  openNote(note) {
    this.props.history.push("/note/" + note.uuid);
  }

  componentDidMount() {
    //this.writeUserData();
    this.loadNotes();
  }

  truncate(text) {
    if (text.length > 40) {
      return text.substring(0, 40) + "...";
    } else {
      return text;
    }
  }

  render() {
    return (
      <div>
        <Container>
        <Row>
          {this.state.notes.map((n) =>
            <Col className="col-sm-4">
              <Card className="m-3">
                <Card.Title className="m-4">{n.body}</Card.Title>
                <Card.Body className="m-2" onClick={() => this.openNote(n)}>
                  {this.truncate(n.body)}
                </Card.Body>
              </Card>
            </Col>
          )}
          </Row>
          </Container>
      </div>
    );
  }
}
  
export default withRouter(NotesPage);
