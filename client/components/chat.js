import axios from 'axios'
import React, {Component} from 'react'
import ChatHistory from './chat-history'

export class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      messages: [],
      busy: false
    }
  }
  componentDidMount() {
    this.initializeBot()
  }

  initializeBot() {
    axios
      .post('/api/bot/initiate', {option: 'LEX'})
      .then(() => console.log('Bot has been successfully initiated.'))
      .catch(err => console.error(err))
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  handleSubmit(evt) {
    evt.preventDefault()

    const {text, messages} = this.state
    if (!text) return

    this.setState({busy: true, messages: [...messages, text]})

    axios
      .post('/api/bot/message', {text})
      .then(res => res.data)
      .then(data => {
        this.setState({
          busy: false,
          text: '',
          messages: [...messages, text, data.message]
        })
      })
      .catch(err => console.error(err))
  }

  render() {
    const {text, messages, busy} = this.state
    return (
      <div id="chat-main">
        {/* can add a switch setting later to change bot through UI */}
        <ChatHistory messages={messages} />
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            name="text"
            type="text"
            value={text}
            onChange={this.handleChange.bind(this)}
            placeholder="Send message to bot here..."
            className="inputField"
          />
          <input disabled={busy} type="submit" style={{display: 'none'}} />
        </form>
      </div>
    )
  }
}

export default Chat
