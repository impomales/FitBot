import axios from 'axios'
import React, {Component} from 'react'
import ChatHistory from './chat-history'

export class Chat extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      received: '',
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

    const {text} = this.state

    this.setState({busy: true})

    axios
      .post('/api/bot/message', {text})
      .then(res => res.data)
      .then(data => {
        this.setState({received: data.message, busy: false, text: ''})
      })
      .catch(err => console.error(err))
  }

  render() {
    const {text, received, busy} = this.state
    return (
      <div>
        {/* can add a switch setting later to change bot through UI */}
        <ChatHistory received={received} />
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            name="text"
            type="text"
            value={text}
            onChange={this.handleChange.bind(this)}
          />
          <input disabled={busy} type="submit" style={{display: 'none'}} />
        </form>
      </div>
    )
  }
}

export default Chat
