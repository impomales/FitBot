import React, {Component} from 'react'

class ChatHistory extends Component {
  componentDidUpdate() {
    const messages = document.querySelector('#chat-history ul')
    if (messages.scrollTop + messages.clientHeight !== messages.scrollHeight) {
      messages.scrollTop = messages.scrollHeight
    }
  }

  render() {
    const {messages} = this.props
    let messageFlag = 'received'
    let avatar
    return (
      <div id="chat-history">
        <ul>
          {messages.map((message, idx) => {
            avatar =
              message.type === 'sent' ? (
                <i className="fas fa-user" />
              ) : (
                <i className="fas fa-robot" />
              )

            if (message.type === 'status') avatar = ''
            return (
              <li className={`${message.type} message`} key={idx}>
                {avatar}
                {message.content}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default ChatHistory
