import React, { Component, PropTypes } from 'react';
import moment from '../../../bower_components/moment/moment';
import ModAction from './ModAction';
import errorLog from '../../utils/errorLog';
import fbase from '../../api/firebase';
import style from '../../../styles/Room/Message.css';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: {},
      modAction: false,
      showActions: '',
    };
  }

  componentDidMount() {
    // TODO: Does this belong in getInitialState of componentDidMount?
    // It seems like it's bad to set state before the component mounts, so maybe here?
    const self = this;
    const authorRef = fbase.child('nametags/' + this.props.roomId +
      '/' + this.props.author);
    authorRef.on('value', function onValue(author) {
      if (author.val()) {
        self.setState(function setState(prevState) {
          prevState.author = author.val();
          prevState.author.id = this.props.author;
          return prevState;
        });
      }
    }, errorLog('Error getting message author info'), this);
  }

  componentWillUnmount() {
    const authorRef = fbase.child('nametags/' + this.props.roomId +
      '/' + this.props.author);
    authorRef.off();
  }

  modAction(open) {
    const self = this;
    return function onClick() {
      self.setState({modAction: open});
    };
  }

  heartAction() {
    return function onClick() {
      // TODO: Add heart action;
    };
  }

  toggleActions() {
    let showActions = this.state.showActions === style.slideOutActions ? style.slideInActions : style.slideOutActions;
    this.setState({showActions: showActions});
  }

  render() {
    let icon;
    let name;
    let below;
    if (this.state.author) {
      icon = this.state.author.icon;
      name = this.state.author.name;
    }

    // TODO: Replace heart with Emoji icon and display

    if (this.state.modAction) {
      below =
        <ModAction
          roomId={this.props.roomId}
          msgId={this.props.id}
          author={this.state.author}
          close={this.modAction(false)}/>;
    } else {
      below =  <div className={style.below}>
          <div className={style.actions + ' ' + this.state.showActions }>
              <span
                className={style.showActions + ' ' + style.actionIcon + ' glyphicon glyphicon-option-vertical'}
                onClick={this.toggleActions.bind(this)}
                aria-hidden="true"/>
              <span
                className={style.actionIcon + ' glyphicon glyphicon-star'}
                aria-hidden="true"/>
              <span className={style.actionIcon + ' glyphicon glyphicon-heart'}
              aria-hidden="true"
              onClick={this.heartAction.bind(this)}/>
              <span
                className={style.actionIcon + ' glyphicon glyphicon-flag'}
                onClick={this.modAction(true).bind(this)}
                aria-hidden="true"/>
              <span
                className={style.hideActions + ' ' + style.actionIcon + ' glyphicon glyphicon-remove'}
                onClick={this.toggleActions.bind(this)}
                aria-hidden="true"/>
          </div>
          <div className={style.date}>
              {moment(this.props.timestamp).format('h:mm A, ddd MMM DD YYYY')}
          </div>
        </div>;
    }

    return <tr
        className={style.message}>
        <td className={style.icon}>
          <img className="img-circle" src={icon}/>
        </td>
        <td className={style.messageText}>
          <div className={style.name}>{name}</div>
          <div className={style.text}>{this.props.text}</div>
          {below}
          <div className={style.msgPadding}></div>
        </td>
      </tr>;
  }
}

Message.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  date: PropTypes.number,
  author: PropTypes.string,
  roomid: PropTypes.string,
};
Message.defaultProps = {
  id: 'msg1',
  text: 'This is the testiest message.',
  timestamp: 1461977139344,
};

export default Message;
