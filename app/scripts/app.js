
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Room from './ui/Room/Room';
import RoomCards from './ui/RoomCard/RoomCards';
import fbase from './api/firebase';

const mountNode = document.getElementById('app');

import { Router, Route, Link, hashHistory } from 'react-router';

class Nametag extends Component {
  constructor(props) {
    super(props);
    const auth = fbase.getAuth();
    this.state = {
      auth: auth,
    };
  }

  getChildContext() {
    return {
      userAuth: this.state.auth,
      unAuth: this.unAuth,
      checkAuth: this.checkAuth,
    };
  }

  unAuth(e) {
    e.preventDefault();
    new fbase.unauth();
    this.checkAuth();
  }

  checkAuth() {
    this.setState( {
      auth: fbase.getAuth(),
    });
  }

  render() {
    return <Router history={hashHistory}>
      <Route path="/" component={RoomCards} />
      <Route path="/rooms" component={RoomCards}/>
      <Route path="/rooms/:roomId" component={Room}/>
    </Router>;
  }
}

Nametag.childContextTypes = {
  userAuth: PropTypes.object,
  unAuth: PropTypes.func,
  checkAuth: PropTypes.func,
};

ReactDOM.render(<Nametag/>, mountNode);

