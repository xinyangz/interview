import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import RoomTitle from './RoomTitle';
import ControlTab from './ControlTab';
import {loadInterviewerRoom} from '../../actions/roomsActions';

const room = {
  "interviewer" : "Jason Yip",
  "candidates" : [ "1", "2", "3" ],
  "name" : "计蒜课秋招（前端）",
  "logo" : "http://example.com/examplepage",
  "id" : "1001",
  "problems" : [ "10", "11", "12" ]
};

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
  room: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    room: state.roomsStates.room
  };
}

export default connect(mapStateToProps, {loadInterviewerRoom})(InterviewerPage);
