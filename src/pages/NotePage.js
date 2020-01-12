import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

let quill = null;
class NotePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
    this.prevText = null;
    this.timer = null;

    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
    }
    this.formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ]
  }

  updateData() {
    this.prevText = this.state.text;
    this.setState({ text: quill.getContents() });
    // console.log(quill.getContents());
    // console.log(this.prevText.ops);
    if (this.prevText == null || this.prevText.ops == null || this.state.text == null || this.state.text.ops == null) {
      return;
    }

    if (this.prevText.ops.length !== this.state.text.ops.length ||
      Object.keys(this.prevText.ops[this.prevText.ops.length - 1])[0] !==
      Object.keys(this.state.text.ops[this.state.text.ops.length - 1])[0] ||
      Object.values(this.prevText.ops[this.prevText.ops.length - 1])[0] !==
      Object.values(this.state.text.ops[this.state.text.ops.length - 1])[0]) {
      this.writeUserData();
    }
  }

  writeUserData() {
    let data = this.state.text;
    console.log("Writing: " + data);
    let user = firebase.default.auth().currentUser;

    if (user != null) {
      let uid = user.uid;
      firebase.default.database().ref('/users/'+uid+'/notes').push({
        title: data,
        body: data,
        timestamp: Date.now(),
      });
    }
  }

  componentDidMount() {
    quill = this.refs.quill.getEditor();
    this.timer = setInterval(() => this.updateData(), 3000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="editor ml-3 mr-3">
        <ReactQuill theme="snow" ref="quill"
                    value={this.state.text} 
                    onChange={this.handleChange}
                    modules={this.modules}
                    formats={this.formats} />
      </div>
    )
  }
}
  
  export default NotePage;