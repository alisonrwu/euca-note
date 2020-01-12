import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import * as Delta from "quill-delta/dist/Delta";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {generateUUID} from "../helpers/uuid";
import { withRouter } from "react-router-dom";

let quill = null;
class NotePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "", noteId: null }; // You can also pass a Quill Delta here
    this.timer = null;
    this.writeDelta = this.writeDelta.bind(this);
    this.fetchRemoteDeltas = this.fetchRemoteDeltas.bind(this);

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
    if (this.noteId == null) return;
    let user = firebase.default.auth().currentUser;
    if (user != null) {
      let uid = user.uid;
      let self = this;
      firebase.default
        .database()
        .ref("/users/" + uid + "/" + this.noteId)
        .once("value", function(data) {
          if (data === null || data.val() === null || data.val().writeId === self.writeId) {
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
    if (this.noteId == null) return;
    let user = firebase.default.auth().currentUser;
    console.log("Attempting to write\n");

    if (user != null) {
      let uid = user.uid;
      let self = this;
      console.log("Writing delta:\n" + JSON.stringify(delta));
      firebase.default
        .database()
        .ref("/users/" + uid + "/" + this.noteId)
        .transaction(function(currentValue) {
          if (currentValue == null) {
            self.writeId = generateUUID();
            return {
              timestamp: Date.now(),
              body: new Delta(delta.ops),
              uuid: self.noteId,
              writeId: self.writeId,
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
    this.noteId = this.props.match.params.noteId;
    if (!this.noteId) {
      this.props.history.push("/" + generateUUID());
      return;
    }
  }

  componentDidMount() {
    quill = this.refs.quill.getEditor();
    this.timer = setInterval(() => this.fetchRemoteDeltas(), 1000);
    let self = this;
    console.log("hello");
    quill.on("text-change", function(delta, oldDelta, source) {
      console.log("quill text: " + source);
      if (source === 'silent') return;
      self.writeDelta(delta);
    });
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="editor ml-3 mr-3">
        <ReactQuill
          theme="bubble"
          ref="quill"
          value={this.state.text}
          modules={this.modules}
          formats={this.formats}
        />
      </div>
    );
  }
}

export default withRouter(NotePage);
