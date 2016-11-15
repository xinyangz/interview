import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import RoomTitle from './RoomTitle';
import ControlTab from './ControlTab';
import {loadInterviewerRoom} from '../../actions/roomsActions';

class InterviewerPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.loadInterviewerRoom();
  }

  render() {
    return (
      <div>
        <h1>{}</h1>
        <RoomTitle room={this.props.room}/>
        <ControlTab/>
      </div>
    );
  }
}

InterviewerPage.propTypes = {
  room: PropTypes.object.isRequired,
  loadInterviewerRoom: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    room: state.roomsStates.room
  };
}

export default connect(mapStateToProps, {loadInterviewerRoom})(InterviewerPage);
