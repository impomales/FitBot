import React, {Component} from 'react'

class ChatHistory extends Component {
  componentDidUpdate() {
    const messages = document.querySelector('#chat-history ul')
    console.log(messages.scrollTop)
    console.log(messages.scrollHeight)
    console.log(messages.clientHeight)
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
            messageFlag = messageFlag === 'sent' ? 'received' : 'sent'
            avatar =
              messageFlag === 'sent' ? (
                <i className="fas fa-user" />
              ) : (
                <i className="fas fa-robot" />
              )
            return (
              <li className={`${messageFlag} message`} key={idx}>
                {avatar}
                {message}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default ChatHistory
