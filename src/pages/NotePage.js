import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import * as Delta from "quill-delta/dist/Delta";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { generateUUID } from "../helpers/uuid";
import { withRouter } from "react-router-dom";

import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

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
class NotePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { note: null, noteId: null, tags: [] }; // You can also pass a Quill Delta here
    this.timer = null;
    this.writeDelta = this.writeDelta.bind(this);
    this.fetchRemoteDeltas = this.fetchRemoteDeltas.bind(this);
    this.handleTagCreation = this.handleTagCreation.bind(this);
    this.handleRemoveTag = this.handleRemoveTag.bind(this);

    this.modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" }
        ],
        ["link", "image"],
        ["clean"]
      ]
    };
    this.formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image"
    ];
  }

  fetchRemoteDeltas() {
    if (this.props.match.params.noteId == null) {
      this.props.history.push("/" + generateUUID());
      return;
    }
    let user = firebase.default.auth().currentUser;
    if (user != null) {
      let uid = user.uid;
      let self = this;
      firebase.default
        .database()
        .ref("/users/" + uid + "/notes/" + this.props.match.params.noteId)
        .once("value", function(data) {
          if (
            data === null ||
            data.val() === null ||
            data.val().writeId === self.writeId
          ) {
            return;
          } else {
            console.log("Setting to\n" + JSON.stringify(data.val().body));
            let range = quill.getSelection();
            quill.setContents(data.val().body, "silent");
            if (range) {
              quill.setSelection(range.index, range.length, "silent");
            }
          }
        });
    }
  }

  writeDelta(delta) {
    console.log(this.props.match.params.noteId);
    if (this.props.match.params.noteId == null) {
      this.props.history.push("/" + generateUUID());
      return;
    }
    let user = firebase.default.auth().currentUser;
    console.log("Attempting to write\n");

    if (user != null) {
      let uid = user.uid;
      let self = this;
      console.log("Writing delta:\n" + JSON.stringify(delta));
      firebase.default
        .database()
        .ref("/users/" + uid + "/notes/" + this.props.match.params.noteId)
        .transaction(function(currentValue) {
          if (currentValue == null) {
            self.writeId = generateUUID();
            return {
              timestamp: Date.now(),
              title: Date.now(),
              body: new Delta(delta.ops),
              uuid: self.noteId,
              writeId: self.writeId,
              tags: self.state.tags,
            };
          }
          let res = new Delta(currentValue.body.ops).compose(delta);
          console.log(JSON.stringify(res));
          currentValue.body = res;
          return currentValue;
        });
    }
  }

  componentDidUpdate() {
    console.log(this.props.match.params.noteId);
    if (!this.props.match.params.noteId) {
      this.props.history.push("/" + generateUUID());
      return;
    }
    let note = this.props.notes.find(e => e.uuid == this.props.match.params.noteId);
    console.log("Got note: " + JSON.stringify(note));
    if (note) {
      quill.setContents(note.body);
      this.setState({
        tags: note.tags
      })
    }
  }

  componentDidMount() {
    quill = this.refs.quill.getEditor();
    this.timer = setInterval(() => this.fetchRemoteDeltas(), 1000);
    let self = this;
    quill.on("text-change", function(delta, oldDelta, source) {
      if (source === "silent") return;
      console.log(delta);
      self.writeDelta(delta);
    });
    this.tagInput = React.createRef();
    quill.setSelection(0);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleTagCreation(target) {
    if (target.key == "Enter") {
      let tags = this.state.tags;
      if (tags.map(t => t.name).includes(this.tagInput.current.value)) {
        this.tagInput.current.value = "";
        return;
      }
      tags.push({
        name: this.tagInput.current.value,
        color: PillVariants[Math.floor(Math.random() * PillVariants.length)]
      });
      this.setState({
        tags: tags
      });
      this.tagInput.current.value = "";
    }
  }

  handleRemoveTag(name) {
    let tags = this.state.tags;
    tags = tags.filter(t => t.name != name);
    this.setState({
      tags: tags
    });
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>Tags</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            ref={this.tagInput}
            onKeyPress={this.handleTagCreation}
            placeholder="Type something and press enter to create a tag!"
            aria-label="Tag"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <Container>
              <Row>
                {this.state.tags.map(t => (
                  <h3 onClick={() => this.handleRemoveTag(t.name)}>
                    <Badge className="m-1" pill variant={t.color}>
                      {t.name}
                    </Badge>
                  </h3>
                ))}
              </Row>
            </Container>
        <div className="editor ml-3 mr-3">
          <ReactQuill
            theme="snow"
            ref="quill"
            modules={this.modules}
            formats={this.formats}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(NotePage);
