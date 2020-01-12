import React from 'react';
import ReactQuill from 'react-quill';

class NotePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    this.setState({ text: value })
  }

  render() {
    return (
      <div className="editor">
        <ReactQuill value={this.state.text} 
                    onChange={this.handleChange} />
      </div>
    )
  }
}
  
  export default NotePage;