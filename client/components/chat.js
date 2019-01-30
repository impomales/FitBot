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
      sessionUserIdLex: '',
      sessionUserIdFlow: '',
      option: ''
    }
  }
  componentDidMount() {
    this.initializeBot()
  }

  initializeBot() {
    let {option, sessionUserIdFlow, sessionUserIdLex} = this.state
    axios
      .post('/api/bot/initiate', {option})
      .then(res => res.data)
      .then(({sessionUserId, bot}) => {
        console.log(`${bot.type} Bot has been successfully initiated.`)
        sessionUserIdLex = bot.type === 'LEX' ? sessionUserId : sessionUserIdLex
        sessionUserIdFlow =
          bot.type === 'DIALOG_FLOW' ? sessionUserId : sessionUserIdFlow
        this.setState({option: bot.type, sessionUserIdLex, sessionUserIdFlow})
      })
      .catch(err => console.error(err))
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  handleChangeSelect(evt) {
    this.setState({[evt.target.name]: evt.target.value}, () => {
      const {option, sessionUserIdLex, sessionUserIdFlow} = this.state
      // only initialize bot first time.
      const bot = option === 'LEX' ? sessionUserIdLex : sessionUserIdFlow
      if (!bot) this.initializeBot()
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()

    const {
      text,
      messages,
      sessionUserIdLex,
      sessionUserIdFlow,
      option
    } = this.state
    if (!text) return

    this.setState({busy: true, text: '', messages: [...messages, text]})

    const sessionUserId =
      option === 'LEX' ? sessionUserIdLex : sessionUserIdFlow

    axios
      .post('/api/bot/message', {text, sessionUserId, option})
      .then(res => res.data)
      .then(data => {
        this.setState({
          busy: false,
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
