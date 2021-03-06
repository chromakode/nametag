import React, { Component, PropTypes } from 'react'
import errorLog from '../../utils/errorLog'
import VisOptions from './VisibilityOptions'
import ModActionButtons from './ModActionButtons'
import Alert from '../Utils/Alert'
import { Card } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import {List, ListItem} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import TextField from 'material-ui/TextField'

class ModAction extends Component {

  constructor (props) {
    super(props)

    this.state = {
      normChecks: [],
      isPublic: false,
      note: '',
      escalated: false
    }

    this.showNorm = (norm, i) => {
      return <ListItem
        leftCheckbox={<Checkbox checked={this.state.normChecks[i]} />}
        primaryText={norm}
        key={i}
        onClick={this.checkNorm(i)} />
    }

    this.checkNorm = (normIndex) => {
      let self = this
      return (e) => {
        e.preventDefault()
        // Need to setTimeout so that preventDefault doesn't break checkboxes
        // This is a React-recommended hack.
        setTimeout(() => {
          self.setState((previousState) => {
            previousState.normChecks[normIndex] = !previousState.normChecks[normIndex]
            return previousState
          })
        }, 1)
      }
    }

    this.remindOfNorms = () => {
      const {author, text, norms, close, createMessage, roomId, myNametag, mod} = this.props
      const {normChecks, isPublic, note} = this.state
      const isMod = mod.id === myNametag.id

      if (normChecks.length === 0) {
        this.setState({alert: 'Please check at least one norm.'})
        return
      }

      const checkedNorms = norms.filter((norm, i) => normChecks[i])

      let message
      if (isMod) {
        message = isPublic ? `@${author.name} \n` : `d ${author.name} \n`
      } else {
        message = `d ${mod.name} \n`
      }
      message += isMod ? '### Note from the Moderator\n\n'
        : `### Message Report\n\n`
      message += `\n> ${text}\n`
      message += `${checkedNorms.reduce((msg, norm) => `${msg}* **${norm}** \n`, '')}\n`
      message += `*${note}*`
      let modAction = {
        text: message,
        author: myNametag.id,
        room: roomId
      }
      createMessage(modAction, myNametag)
      .catch((err) => {
        this.setState({alert: 'Error posting reminder'})
        errorLog('Error putting mod Action')(err)
      })
      close()
    }

    this.setPublic = (isPublic) => {
      return (e) => {
        e.preventDefault()
        this.setState({isPublic})
      }
    }

    this.removeUser = () => {
      // TODO: Add functionality to remove user.
    }

    this.censorMessage = () => {
      // TODO: Add functionality to censor a message
    }

    this.addNote = (e) => {
      e.preventDefault()
      this.setState({note: e.target.value})
    }

    this.notifyBadge = () => {
      // TODO:Notify badge granters
    }
  }

  render () {
    // TODO: I could add complexity here, cite multiple posts, etc.
    // TODO: Create a system for notifying badgeholders.

    const {close, author, myNametag, mod, norms} = this.props
    const {alert, note, isPublic} = this.state
    const isMod = mod.id === myNametag.id

    return <Card style={styles.modAction}>
      <IconButton
        style={styles.closeButton}
        onClick={close}>
        <FontIcon
          className='material-icons'>
          close
        </FontIcon>
      </IconButton>
      {
        isMod ? <h4 style={styles.title}>Remind {author.name} of Conversation Norms</h4>
      : <h4 style={styles.title}>Report This Post to the Moderator</h4>
      }
      <List>
        {norms.map(this.showNorm)}
      </List>
      <TextField
        style={styles.addNote}
        onChange={this.addNote}
        hintText='Add an optional note.'
        value={note} />
      {
        isMod && <VisOptions
          isPublic={isPublic}
          setPublic={this.setPublic} />
      }
      <Alert alert={alert} alertType='danger' />
      <ModActionButtons
        isMod={isMod}
        remindOfNorms={this.remindOfNorms}
        removeUser={this.removeUser}
        notifyBadge={this.notifyBadge}
        authorName={author.name}
        censorMessage={this.censorMessage} />
    </Card>
  }
}

ModAction.propTypes = {
  msgId: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  mod: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  createMessage: PropTypes.func.isRequired
}

export default ModAction

const styles = {
  title: {
    marginLeft: 20
  },
  addNote: {
    width: 'inherit',
    display: 'block'
  },
  modAction: {
    maxWidth: 500,
    borderRadius: 6,
    padding: 10,
    margin: '20px 30px'
  },
  closeButton: {
    float: 'right',
    padding: 0,
    height: 'auto'
  }
}
