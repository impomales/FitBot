import React from 'react'

export const ChatHistory = ({messages}) => {
  return (
    <div id="chat-history">
      <ul>{messages.map((message, idx) => <li key={idx}>{message}</li>)}</ul>
    </div>
  )
}

export default ChatHistory
