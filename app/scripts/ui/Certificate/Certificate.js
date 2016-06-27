import React, { Component, PropTypes } from 'react';
import moment from '../../../bower_components/moment/moment';
import { dragTypes } from '../../constants';
import { DragSource } from 'react-dnd';

// TODO: This currently displays all user certificates, as opposed to only the participant certificates. A major violation of trust!

const certSource = {
  beginDrag(props) {
    return {certificateId: props.certificate.id};
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}

class Certificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    let certificate;
    let icon = '';
    if (this.props.certificate.icon_array) {
      icon = <img className="icon" alt="icon" src={this.props.certificate.icon_array[0]}/>;
    }
    if (this.state.expanded) {
      certificate = <div className="certificateExpanded">
            <span
              aria-hidden="true"
              className="glyphicon glyphicon-remove"
              onClick={this.toggleExpanded.bind(this)}>
            </span>
            { icon }
            <div className="name">{this.props.certificate.name}</div>
            <div className="granter">Verified by: {this.props.certificate.granter}</div>
            <div className="description">{this.props.certificate.description_array[0]}</div>
            <hr/>
            <div className="notes">
              {this.props.certificate.notes.map(function mapNotes(note) {
                 return <div className="note" key={note.date}>
                    <div className="date">{moment(note.date).format('MMMM Do, YYYY')}: </div>
                    <div className="msg">{note.msg}</div>
                  </div>;
              })}
            </div>
          </div>;
    } else {
      certificate = <div
        className="label label-pill certificate unselectable"
        onClick={this.toggleExpanded.bind(this)}>
          {this.props.certificate.name}
        </div>;
    }

    //Make some certificates draggable
    if (this.props.draggable) {
      certificate = this.props.connectDragSource(certificate);
    }
    return certificate;
  }
}

Certificate.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  draggable: PropTypes.bool.isRequired,
  certificate: PropTypes.object,
  isDragging: PropTypes.bool.isRequired,
};

//TODO: Create constants file.
export default DragSource(dragTypes.certificate, certSource, collect)(Certificate);