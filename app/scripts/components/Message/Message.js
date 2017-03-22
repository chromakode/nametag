import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import ModAction from '../ModAction/ModAction'
import Media from './Media'
import MessageMenu from './MessageMenu'
import emojis from 'react-emoji'
import {grey500, grey800, lightBlue100, yellow100} from 'material-ui/styles/colors'
import ReactMarkdown from 'react-markdown'

class Message extends Component {

  constructor (props) {
    super(props)
    this.state = {modAction: false, showActions: false}

    this.modAction = (open) => (e) => {
      if (e) { e.preventDefault() }
      this.setState({modAction: open})
    }

    this.checkYouTube = (message) => {
      return /[^ ]+youtube\.com[^ .!]+/.exec(message)
    }

    this.checkImage = (message) => {
      return /[^ ]+(\.gif|\.jpg|\.png)/.exec(message)
    }
  }

  render () {
    let below
    let media
    const {
      message: {
        id,
        author,
        createdAt,
        text,
        recipient,
        saved
      },
      norms,
      roomId
    } = this.props

    if (this.checkYouTube(text)) {
      media = <Media url={this.checkYouTube(text)[0]} />
    } else if (this.checkImage(text)) {
      media = <Media url={this.checkImage(text)[0]} />
    }

    if (this.state.modAction) {
      // below =
      //   <ModAction
      //     msgId={id}
      //     author={author}
      //     norms={norms}
      //     text={text}
      //     close={this.modAction(false)}
      //     postMessage={postMessage} />
    } else {
      below = <div style={styles.below}>
        {
        // <MessageMenu
        //   modAction={this.modAction}
        //   showActions={this.state.showActions}
        //   isDM={recipient}
        //   saveMessage={saveMessage}
        //   saved={saved}
        //   id={id} />
        }
        <div style={styles.date}>
          {moment(createdAt).format('h:mm A, ddd MMM DD YYYY')}
        </div>
      </div>
    }

    // Get proper style if the this is a direct message
    let messageStyle
    let callout
    switch (type) {
      case 'direct_message_outgoing':
        messageStyle = {...styles.messageText, ...styles.directMessageOutgoing}
        callout = <div style={styles.dmCallout}>
        Private Message to {recipient.name}
          <img style={styles.tinyIconImg} src={recipient.icon} />
        </div>
        break
      case 'direct_message_incoming':
        messageStyle = {...styles.messageText, ...styles.directMessageIncoming}
        callout = <div style={styles.dmCallout}>Private Message</div>
        break
      default:
        messageStyle = styles.messageText
    }

    return <tr
      style={styles.message}
      id={id}
      onClick={() => this.setState({showActions: !this.state.showActions})}>
      <td style={styles.icon}>
        <img style={styles.iconImg} src={author.icon} />
      </td>
      <td style={messageStyle}>
        <div style={styles.name}>{author.name}</div>
        {
            callout
          }
        <div style={styles.text}>
          {
              emojis.emojify(text).map((emojiText, i) => {
                return emojiText.props ? emojiText : <ReactMarkdown
                  key={i}
                  containerTagName={'span'}
                  className={'messageText'}
                  style={styles.text}
                  source={emojiText}
                  escapeHtml />
              })
            }
        </div>
        {media}
        {below}
      </td>
    </tr>
  }
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    author: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    recipient: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    saved: PropTypes.bool.isRequired
  }).isRequired,
  norms: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  roomId: PropTypes.string.isRequired
}

export default Message

const styles = {
  message: {
    paddingTop: 10,
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10
  },
  directMessageIncoming: {
    backgroundColor: lightBlue100
  },
  directMessageOutgoing: {
    backgroundColor: yellow100
  },
  dmCallout: {
    color: grey800,
    fontStyle: 'italic',
    display: 'inline-block',
    marginLeft: 10
  },
  messageText: {
    width: '100%',
    fontSize: 14,
    paddingRight: 40,
    paddingTop: 10,
    paddingLeft: 10,
    borderRadius: 5,
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word'
  },
  icon: {
    paddingRight: 10,
    paddingLeft: 25,
    paddingTop: 10,
    minWidth: 50,
    verticalAlign: 'top'
  },
  iconImg: {
    borderRadius: 25,
    width: 50,
    height: 50
  },
  tinyIconImg: {
    verticalAlign: 'middle',
    borderRadius: 10,
    width: 20,
    height: 20,
    marginLeft: 5
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    display: 'inline-block'
  },
  date: {
    fontSize: 10,
    fontStyle: 'italic',
    color: grey500,
    height: 22,
    display: 'inline-block'
  },
  text: {
    fontSize: 16
  }
}
