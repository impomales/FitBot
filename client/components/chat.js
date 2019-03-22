import axios from 'axios'
import React, {Component} from 'react'
import ChatHistory from './chat-history'
import {Bar} from 'react-chartjs-2'

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
      // sessionUserIdRasa: '',
      option: '',
      sessionAttributes: {}
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
      // sessionUserIdRasa,
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
        // sessionUserIdRasa =
        //   bot.type === 'RASA' ? sessionUserId : sessionUserIdRasa

        const initMessages = [
          {
            type: 'status',
            content: `You are now chatting with ${bot.type}`
          },
          {
            type: 'received',
            content: `${bot.type.toLowerCase()}: Hello, I am the ${
              bot.type
            } Fitbot. How can I help you?`
          }
        ]
        this.setState({
          option: bot.type,
          sessionUserIdLex,
          sessionUserIdFlow,
          sessionUserIdWatson,
          // sessionUserIdRasa,
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
        // sessionUserIdRasa,
        messages
      } = this.state
      // only initialize bot first time.
      let bot
      if (option === 'LEX') bot = sessionUserIdLex
      else if (option === 'DIALOG_FLOW') bot = sessionUserIdFlow
      else if (option === 'WATSON') bot = sessionUserIdWatson
      // else if (option === 'RASA') bot = sessionUserIdRasa

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
    this.messageBot()
  }

  handleCardButton(evt) {
    this.setState({text: evt.target.value}, () => {
      this.messageBot()
    })
  }

  messageBot() {
    const {
      text,
      messages,
      sessionUserIdLex,
      sessionUserIdFlow,
      sessionUserIdWatson,
      // sessionUserIdRasa,
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
      // else if (option === 'RASA') sessionUserId = sessionUserIdRasa

      axios
        .post('/api/bot/message', {
          text,
          sessionUserId,
          option,
          sessionAttributes: this.state.sessionAttributes
        })
        .then(res => res.data)
        .then(data => {
          let cards, image, chart

          if (data.responseCard) {
            const cardElems = data.responseCard.genericAttachments

            cards = cardElems.map(elem => {
              let buttons
              if (elem.buttons.length > 0) {
                buttons = elem.buttons.map((button, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={this.handleCardButton.bind(this)}
                    value={button.value}
                  >
                    {button.text}
                  </button>
                ))
              }
              return {
                type: 'card',
                content: <div>{buttons}</div>
              }
            })
          }

          if (data.imageUrl) {
            image = {
              type: 'image',
              content: <img src={data.imageUrl} alt="food-image" />
            }
          }

          if (data.chartData) {
            chart = {
              type: 'chart',
              content: this.createChart(data.chartData)
            }
          }

          const received = {
            type: 'received',
            content: `${option.toLowerCase()}: ${data.message}`
          }

          const newMessages = [...messages, sent]
          if (image) newMessages.push(image)
          newMessages.push(received)
          if (cards) newMessages.push(...cards)
          if (chart) newMessages.push(chart)

          this.setState({
            busy: false,
            messages: newMessages,
            sessionAttributes: data.sessionAttributes
          })
        })
        .catch(err => console.error(err))
    })
  }

  createChart(rawData) {
    const data = {
      labels: rawData.days.map(dayStr => {
        const date = new Date(dayStr).toDateString().split(' ')
        date.pop() // remove year
        return date.join(' ')
      }),
      datasets: [
        {
          label: 'Net Calories',
          data: rawData.net,
          backgroundColor: '#0070bc',
          borderColor: '#0070bc',
          borderWidth: 1,
          type: 'line',
          fill: false
        },
        {
          label: 'Calories gained',
          data: rawData.foodCaloriesPerDay,
          backgroundColor: '#32ab42',
          borderColor: '#32ab42',
          borderWidth: 1
        },
        {
          label: 'Calories lost',
          data: rawData.exerciseCaloriesPerDay,
          backgroundColor: 'red',
          borderColor: 'red',
          borderWidth: 1
        }
      ]
    }
    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }

    return <Bar data={data} options={options} width={100} height={43} />
  }

  render() {
    const {text, messages, busy} = this.state
    return (
      <div id="chat-main">
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
          {/* <option value="RASA">Rasa</option> */}
        </select>
      </div>
    )
  }
}

export default Chat
