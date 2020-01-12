import React from 'react';
import { withRouter } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Quill from "quill";

let quill = null;
class NotesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notes: props.notes };
  }

  openNote(note) {
    this.props.history.push("/note/" + note.uuid);
  }

  componentDidMount() {
    quill = new Quill('#hidden-editor');
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

  render() {
    return (
      <div>
        <Container>
        <Row>
          {this.props.notes.map((n) =>
            <Col className="col-sm-4">
              <Card className="m-3">
                <Card.Title className="m-4">{this.convertDeltaToHTML(n.title)}</Card.Title>
                <Card.Body className="m-2" onClick={() => this.openNote(n)}>
                  {this.truncate(this.convertDeltaToHTML(n.body))}
                </Card.Body>
              </Card>
            </Col>
          )}
          </Row>
          </Container>
          <div id="hidden-editor" className="hidden"></div>
      </div>
    );
  }
}
  
export default withRouter(NotesPage);
