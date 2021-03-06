import React, { Component, PropTypes} from 'react'
import Message from './Message'
import {mobile} from '../../../styles/sizes'
import radium from 'radium'

class Messages extends Component {

  constructor (props) {
    super(props)

    this.mapMessage = (message) => {
      const {norms, roomId, myNametag, toggleSaved, mod, createMessage} = this.props
      return <Message
        message={message}
        roomId={roomId}
        key={message.id}
        norms={norms}
        mod={mod}
        toggleSaved={toggleSaved}
        createMessage={createMessage}
        myNametag={myNametag} />
    }

    this.scrollIfNeeded = (oldMessages, newMessages) => {
      const numNewMessages = newMessages.length
      const numPrevMessages = oldMessages.length
      if (numNewMessages > numPrevMessages && numNewMessages > 3) {
        let counter = 0
        let timer = setInterval(() => {
          window.scrollBy(0, 2)
          if (counter >= 50) {
            clearInterval(timer)
          }
          counter++
        }, 0)
      }
    }
  }

  componentDidMount () {
    const {messages} = this.props
    if (messages.length > 0) {
      document.getElementById(messages[messages.length - 1].id).scrollIntoViewIfNeeded()
    }
  }

  componentDidUpdate (prevProps) {
    this.scrollIfNeeded(prevProps.messages, this.props.messages)
  }

  render () {
    const {messages} = this.props
    return <div style={styles.messages}>
      <table style={styles.msgContainer}>
        <tbody>
          {
            messages.map(this.mapMessage)
          }
        </tbody>
      </table>
    </div>
  }
}

Messages.propTypes = {
  roomId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  createMessage: PropTypes.func.isRequired,
  toggleSaved: PropTypes.func.isRequired,
  myNametag: PropTypes.object.isRequired
}

export default radium(Messages)

const styles = {
  messages: {
    minHeight: '100vh',
    height: '100%',
    width: 'calc(100% - 275px)',
    display: 'flex',
    paddingLeft: 275,
    paddingTop: 100,
    scrollBehavior: 'smooth',
    [mobile]: {
      paddingLeft: 30,
      width: 'calc(100% - 30px)'
    }
  },
  msgContainer: {
    marginBottom: 75
  }
}
