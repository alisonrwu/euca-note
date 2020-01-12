import React from 'react';
import { withRouter } from "react-router-dom";

import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

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
        console.log(data.val());
        self.setState({
          notes: (data === null) ? [] : Object.values(data.val())
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
      });
      })
    }
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
                <Card.Body className="m-2">
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
