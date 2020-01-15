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
            notes: data == null || data.val() == null ? [] : Object.values(data.val()),
            displayedNotes: data == null || data.val() == null ? [] : Object.values(data.val())
          });
          console.log(self.state.notes);
        });
    }
  }

  openNote(note) {
    this.props.history.push("/" + note.uuid);
  }

  componentDidMount() {
    quill = new Quill("#hidden-editor");
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
          (opts.tag &&
            n
              .val()
              .tags.map(t => t.name)
              .includes(opts.tag)) ||
          (opts.text && n.val().body.beginsWith(opts.text))
        );
      })
    });
  }

  handleAdd() {
    this.props.history.push("/");
  }

  render() {
    console.log(this.state.displayedNotes);
    return (
      <div>
        {this.state.displayedNotes.length != this.state.notes.length && (
          <Button className="m-4" onClick={() => this.filterNotes(null)}>
            <MdClear />
            &nbsp;Clear Filter
          </Button>
        )}
        <Container>
          <Row className="justify-content-md-center">
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
                    <Card.Title className="m-4">{n.val().title}</Card.Title>
                    <Card.Body className="m-2">
                      <div onClick={() => this.openNote(n.val())}>
                        {this.truncate(this.convertDeltaToHTML(n.val().body))}
                      </div>
                      <footer className="mt-3">
                        {n.val().tags &&
                          n.val().tags.tags.map(t => (
                            <Button
                              variant="outline-light"
                              onClick={() => this.filterNotes({ tag: t.name })}
                            >
                              <h5>
                                <Badge className="m-1" pill variant={t.color}>
                                  {t.name}
                                </Badge>
                              </h5>
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
