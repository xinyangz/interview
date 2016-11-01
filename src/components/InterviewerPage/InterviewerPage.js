import React from 'react';
import RoomTitle from './RoomTitle';
import ControlTab from './ControlTab';

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

  render() {
    return (
      <div>
        <RoomTitle room={room}/>
        <ControlTab/>
      </div>
    );
  }
}

export default InterviewerPage;
