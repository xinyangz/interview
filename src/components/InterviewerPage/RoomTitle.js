import React, {PropTypes} from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import '../../styles/InterviewerPage/interviewer-page.css';

const onButtonClick = () => {
  alert('这里是通向面试房间的入口');
}

const RoomTitle = ({room}) => {
  return(
    <Grid>
      <Row>
        <Col md={3}>
          <h4 className="room-title">{room.name}</h4>
        </Col>
        <Col md={6}>
          <h4>面试官: {room.interviewer} | 人数: {room.candidates === undefined ? 0 : room.candidates.length}</h4>
        </Col>
        <Col md={2}>
          <Button bsStyle="primary" onClick={onButtonClick}>开始面试</Button>
        </Col>
      </Row>
    </Grid>

  );
};

RoomTitle.propTypes = {
  room: PropTypes.object.isRequired
};

export default RoomTitle;
