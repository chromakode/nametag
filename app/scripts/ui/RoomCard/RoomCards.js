

import React, { Component, PropTypes } from 'react';
import RoomCard from './RoomCard';
import errorLog from '../../utils/errorLog';
import Navbar from '../Utils/Navbar';

class RoomCards extends Component {
  constructor(props) {
    super(props);
    this.state = {rooms: []};
  }

  componentDidMount() {
    const roomsRef = new Firebase(process.env.FIREBASE_URL + '/rooms');
    let self = this;
    roomsRef.on('child_added', function onChildAdded(value) {
      self.setState(function setState(prevState) {
        const room = value.val();
        room.id = value.key();
        prevState.rooms.push(room);
        return prevState;
      });
    }, errorLog('Error getting roomCards'));
  }

  componentWillUnmount() {
    const roomsRef = new Firebase(process.env.FIREBASE_URL + '/rooms');
    roomsRef.off('child_added');
  }

  showRoomCard(room) {
    return (
        <RoomCard room={room} key={room.id}/>
      );
  }

  render() {
    return <div id="roomSelection">
        <Navbar userAuth={this.context.userAuth} unAuth={this.context.unAuth}/>
        <div id="roomCards">
          {this.state.rooms.map(this.showRoomCard)}
        </div>
      </div>;
  }
}

RoomCards.contectTypes = {
  userAuth: PropTypes.object,
  unAuth: PropTypes.func,
};

export default RoomCards;
