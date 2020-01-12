import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

class NotePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this)

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

  handleChange(value) {
    this.setState({ text: value })
  }

  render() {
    return (
      <div className="editor ml-3 mr-3">
        <ReactQuill theme="snow"
                    value={this.state.text} 
                    onChange={this.handleChange}
                    modules={this.modules}
                    formats={this.formats} />
      </div>
    )
  }
}
  
  export default NotePage;