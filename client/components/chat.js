import React, {Component} from 'react'
import ChatHistory from './chat-history'

export class Chat extends Component {
  render() {
    return (
      <div>
        <ChatHistory />
        <form>
          <input type="text" />
          <input type="submit" style={{display: 'none'}} />
        </form>
      </div>
    )
  }
}

export default Chat
