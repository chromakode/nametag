import React, { Component, PropTypes } from 'react'
import Login  from '../User/Login'
import EditNametag  from '../Nametag/EditNametag'
import UserCertificates  from '../Certificate/UserCertificates'
import {joinRoom} from '../../actions/RoomActions'
import {grey400, indigo500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  join: {
    textAlign: 'center',
  },
  userCertificates: {
    width: 270,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5,
  },
  userCertificateText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: grey400,
  },
  button: {
    color: '#fff',
    fontWeight: 'bold',
  },
}

class Join extends Component {

  onJoinClick() {
    this.context.dispatch(joinRoom(this.props.room, this.props.userNametag, this.context.user.id))
      .then(() => {
        window.location = '/#/rooms/' + this.props.room
      })
  }

  render() {
    let join
    if (this.context.user && this.context.user.id) {
      join =
        <div style={styles.join}>
          <h4>Write Your Nametag For This Conversation</h4>
          <EditNametag
            userNametag={this.props.userNametag}
            addUserNametagCert={this.props.addUserNametagCert}
            removeUserNametagCert={this.props.removeUserNametagCert}
            updateUserNametag={this.props.updateUserNametag}
            room={this.props.room}/>
          <div style={styles.userCertificates}>
            <p style={styles.userCertificateText}>
              Click to view your certificates.<br/>
              Drag them over to show them in this conversation.
            </p>
            <UserCertificates
              selectedCerts = {this.props.userNametag.certificates}/>
          </div>
          <br/>
          <RaisedButton
            backgroundColor={indigo500}
            style={styles.button}
            onClick={this.onJoinClick.bind(this)}>
              Join
          </RaisedButton>
        </div>
    } else {
      join = <Login providerAuth={this.props.providerAuth}/>
    }
    return join
  }
}

Join.propTypes = {
  room: PropTypes.string.isRequired,
  normsChecked: PropTypes.bool.isRequired,
  userNametag: PropTypes.object,
}

Join.contextTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Join
