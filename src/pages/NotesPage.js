import React from "react";
import { withRouter } from "react-router-dom";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Quill from "quill";

import { MdClear } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { generateUUID } from "../helpers/uuid";

const PillVariants = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark"
];

let quill = null;
class NotesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notes: props.notes, displayedNotes: props.notes };
    this.loadNotes = this.loadNotes.bind(this);
    this.filterNotes = this.filterNotes.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  loadNotes() {
    console.log("Reading");
    let self = this;
    let user = firebase.default.auth().currentUser;
    if (user != null) {
      let uid = user.uid;
      firebase.default
        .database()
        .ref("/users/" + uid + "/notes")
        .once("value", function(data) {
          console.log(JSON.stringify(data));
          console.log(data.val());
          self.setState({
            notes: data === null ? [] : Object.values(data.val()),
            displayedNotes: data === null ? [] : Object.values(data.val())
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
      console.log(
        PillVariants[Math.floor(Math.random() * PillVariants.length)]
      );
      console.log(
        PillVariants[Math.floor(Math.random() * PillVariants.length)]
      );
      data.forEach((n, idx) => {
        firebase.default
          .database()
          .ref("/users/" + uid + "/notes")
          .push({
            title: n,
            body: n,
            timestamp: Date.now(),
            uuid: generateUUID(),
            tags:
              idx % 2 === 0
                ? [
                    {
                      name: "a",
                      color:
                        PillVariants[
                          Math.floor(Math.random() * PillVariants.length)
                        ]
                    },
                    {
                      name: "b",
                      color:
                        PillVariants[
                          Math.floor(Math.random() * PillVariants.length)
                        ]
                    },
                    {
                      name: "c",
                      color:
                        PillVariants[
                          Math.floor(Math.random() * PillVariants.length)
                        ]
                    }
                  ]
                : [
                    {
                      name: "a",
                      color:
                        PillVariants[
                          Math.floor(Math.random() * PillVariants.length)
                        ]
                    }
                  ]
          });
      });
    }
  }

  openNote(note) {
    this.props.history.push("/" + note.uuid);
  }

  componentDidMount() {
    quill = new Quill("#hidden-editor");
    this.writeUserData();
    this.loadNotes();
  }

  convertDeltaToHTML(delta) {
    quill.setContents(delta);
    return quill.getText();
  }

  truncate(text) {
    if (text.length > 40) {
      return text.substring(0, 40) + "...";
    } else {
      return text;
    }
  }

  filterNotes(opts) {
    this.setState({
      displayedNotes: this.state.notes.filter(n => {
        return (
          opts == null ||
          (opts.tag && n.tags.map(t => t.name).includes(opts.tag)) ||
          (opts.text && n.body.beginsWith(opts.text))
        );
      })
    });
  }

  handleAdd() {
    this.props.history.push("/");
  }

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-md-center">
            {this.state.displayedNotes.length > 0 && (
              <Button onClick={() => this.filterNotes(null)}>
                <MdClear />
              </Button>
            )}
            {this.state.displayedNotes.length === 0 ? (
              <Card className="m-5">
                <Card.Body>
                  <Container>
                    <Row className="m-2">
                      <h4>Added notes are shown here</h4>
                    </Row>
                    <Row className="m-2 justify-content-md-center">
                      <Button size="lg" onClick={this.handleAdd}>
                        <IoMdAdd />
                        &nbsp;Add note
                      </Button>
                    </Row>
                  </Container>
                </Card.Body>
              </Card>
            ) : (
              this.state.displayedNotes.map(n => (
                <Col className="col-sm-4">
                  <Card className="m-3">
                    <Card.Title className="m-4">
                      {n.title}
                    </Card.Title>
                    <Card.Body className="m-2">
                      <div onClick={() => this.openNote(n)}>
                        {this.truncate(this.convertDeltaToHTML(n.body))}
                      </div>
                      <footer className="mt-3">
                        {n.tags.map((t) => (
                          <Button
                            variant="outline-light"
                            onClick={() => this.filterNotes({ tag: t.name })}
                          >
                            <Badge className="m-1" pill variant={t.color}>
                              {t.name}
                            </Badge>
                          </Button>
                        ))}
                      </footer>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
        <div id="hidden-editor" className="hidden"></div>
      </div>
    );
  }
}

export default withRouter(NotesPage);
