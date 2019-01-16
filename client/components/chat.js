import axios from 'axios'
import React, {Component} from 'react'
import ChatHistory from './chat-history'

export class Chat extends Component {
  componentDidMount() {
    this.initializeBot()
  }

  initializeBot() {
    axios
      .post('/api/bot/initiate', {option: 'LEX'})
      .then(() => console.log('Bot has been successfully initiated.'))
      .catch(err => console.error(err))
  }

  render() {
    return (
      <div>
        {/* can add a switch setting later to change bot through UI */}
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
