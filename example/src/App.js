import React, { Component } from 'react'

import ReactEmojiInput from 'react-emoji-input'

export default class App extends Component {
  state = {
    html: ''
  }

  handleHTMLChange = html => {
    this.setState({html})
  }

  render () {
    return (
      <div style={{
        height: '640px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        <ReactEmojiInput html={this.state.html} onChange={this.handleHTMLChange} />
      </div>
    )
  }
}
