import React, {PropTypes} from 'react';
import {Grid, Row, Col, Tab, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem} from 'react-bootstrap';
import '../../styles/InterviewerPage/interviewer-page.css';

const RoomTitle = ({room}) => {
  return(
    <Grid>
      <Row>
        <Col md={3}>
          <h4 className="room-title">{room.name}</h4>
        </Col>
        <Col md={9}>
          <h4>面试官: {room.interviewer} | 人数: {room.candidates.length}</h4>
        </Col>
      </Row>
    </Grid>

  )
};

RoomTitle.propTypes = {
  room: PropTypes.object.isRequired
};

export default RoomTitle;
