import axios from 'axios'
import React, {Component} from 'react'
import ChatHistory from './chat-history'

export class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      messages: [],
      busy: false,
      sessionUserId: '',
      option: ''
    }
  }
  componentDidMount() {
    this.initializeBot()
  }

  initializeBot() {
    const {option} = this.state
    axios
      .post('/api/bot/initiate', {option})
      .then(res => res.data)
      .then(({sessionUserId, bot}) => {
        console.log('Bot has been successfully initiated.')
        this.setState({sessionUserId, option: bot.type})
      })
      .catch(err => console.error(err))
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  handleChangeSelect(evt) {
    this.setState({[evt.target.name]: evt.target.value}, () => {
      this.initializeBot()
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()

    const {text, messages, sessionUserId} = this.state
    if (!text) return

    this.setState({busy: true, messages: [...messages, text]})

    axios
      .post('/api/bot/message', {text, sessionUserId})
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
            className="input-field"
          />
          <input disabled={busy} type="submit" style={{display: 'none'}} />
        </form>
        <select
          name="option"
          value={this.state.option}
          onChange={this.handleChangeSelect.bind(this)}
        >
          <option value="LEX">Amazon Lex</option>
          <option value="DIALOG_FLOW">Google Dialog Flow</option>
        </select>
      </div>
    )
  }
}

export default Chat
