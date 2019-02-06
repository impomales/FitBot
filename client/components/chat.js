import axios from 'axios'
import React, {Component} from 'react'
import ChatHistory from './chat-history'

const botOptions = ['LEX', 'DIALOG_FLOW', 'WATSON']

export class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      messages: [],
      busy: false,
      sessionUserIdLex: '',
      sessionUserIdFlow: '',
      sessionUserIdWatson: '',
      option: ''
    }
  }
  componentDidMount() {
    this.initializeBot()
  }

  initializeBot() {
    let {
      option,
      sessionUserIdFlow,
      sessionUserIdLex,
      sessionUserIdWatson,
      messages
    } = this.state
    axios
      .post('/api/bot/initiate', {option})
      .then(res => res.data)
      .then(({sessionUserId, bot}) => {
        console.log(`${bot.type} Bot has been successfully initiated.`)
        sessionUserIdLex = bot.type === 'LEX' ? sessionUserId : sessionUserIdLex
        sessionUserIdFlow =
          bot.type === 'DIALOG_FLOW' ? sessionUserId : sessionUserIdFlow
        sessionUserIdWatson =
          bot.type === 'WATSON' ? sessionUserId : sessionUserIdWatson

        const initMessages = [
          {
            type: 'status',
            content: `You are now chatting with ${bot.type}`
          },
          {
            type: 'received',
            content: `Hello, I am the ${bot.type} Fitbot. How can I help you?`
          }
        ]
        this.setState({
          option: bot.type,
          sessionUserIdLex,
          sessionUserIdFlow,
          sessionUserIdWatson,
          messages: [...messages, ...initMessages]
        })
      })
      .catch(err => console.error(err))
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  handleChangeSelect(evt) {
    this.setState({[evt.target.name]: evt.target.value}, () => {
      const {
        option,
        sessionUserIdLex,
        sessionUserIdFlow,
        sessionUserIdWatson,
        messages
      } = this.state
      // only initialize bot first time.
      let bot
      if (option === 'LEX') bot = sessionUserIdLex
      else if (option === 'DIALOG_FLOW') bot = sessionUserIdFlow
      else if (option === 'WATSON') bot = sessionUserIdWatson

      const message = {
        type: 'status',
        content: `You are now chatting with ${option}`
      }
      if (!bot) this.initializeBot()
      else
        this.setState({
          option,
          messages: [...messages, message]
        })
    })
  }

  handleSubmit(evt) {
    evt.preventDefault()

    const {
      text,
      messages,
      sessionUserIdLex,
      sessionUserIdFlow,
      sessionUserIdWatson,
      option
    } = this.state
    if (!text) return

    const sent = {
      type: 'sent',
      content: text
    }

    this.setState({busy: true, text: '', messages: [...messages, sent]}, () => {
      let sessionUserId
      if (option === 'LEX') sessionUserId = sessionUserIdLex
      else if (option === 'DIALOG_FLOW') sessionUserId = sessionUserIdFlow
      else if (option === 'WATSON') sessionUserId = sessionUserIdWatson

      axios
        .post('/api/bot/message', {text, sessionUserId, option})
        .then(res => res.data)
        .then(data => {
          const received = {
            type: 'received',
            content: `${option.toLowerCase()}: ${data.message}`
          }
          this.setState({
            busy: false,
            messages: [...messages, sent, received]
          })
        })
        .catch(err => console.error(err))
    })
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
          <option value="WATSON">IBM Watson Assistant</option>
        </select>
      </div>
    )
  }
}

export default Chat
