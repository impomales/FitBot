import React, {Component} from 'react'

class ChatHistory extends Component {
  componentDidUpdate() {
    if (
      this.messagesRef.scrollTop + this.messagesRef.clientHeight !==
      this.messagesRef.scrollHeight
    ) {
      this.messagesRef.scrollTop = this.messagesRef.scrollHeight
    }
  }

  render() {
    const {messages} = this.props
    let avatar
    return (
      <div id="chat-history">
        <ul
          ref={el => {
            this.messagesRef = el
          }}
        >
          {messages.map((message, idx) => {
            avatar =
              message.type === 'sent' ? (
                <i className="fas fa-user" />
              ) : (
                <i className="fas fa-robot" />
              )

            if (message.type === 'status' || message.type === 'options')
              avatar = ''
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
