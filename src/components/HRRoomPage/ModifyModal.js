import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Modal, Button, Form, FormControl, FormGroup, Col, ControlLabel} from 'react-bootstrap';
import {modifyRoom} from '../../actions/roomsActions';

export class ModifyModal extends React.Component {
  constructor(props) {
    super(props);
    this.onEditRoomClick = this.onEditRoomClick.bind(this);
  }

  onEditRoomClick(event) {
    event.preventDefault();
    const name = ReactDOM.findDOMNode(this.refs.name).value;
    let logo = ReactDOM.findDOMNode(this.refs.logo).files[0];
    const room_id = this.props.roomId;

    function clone(obj) {
      // Handle the 2 simple types, and null or undefined
      if (null == obj || "object" != typeof obj) return obj;
      if (obj instanceof Array) {
        let copy = [];
        for (let i = 0; i < obj.length; ++i) {
          copy[i] = clone(obj[i]);
        }
        return copy;
      }
      if (obj instanceof Object) {
        let copy = {};
        for (let attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
      }
    }
    const roomToChange = this.props.rooms.find(room => room.id === room_id);
    const nameToChange = {"name": name};
    let newRoom = clone(roomToChange);
    if(nameToChange.name != "")
      newRoom.name = nameToChange.name;
    this.props.modifyRoom({newRoom,room_id,logo});
    this.props.onHide();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>房间信息</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form horizontal encType="multipart/form-data" method="put" name="roomInfo">
            <FormGroup controlId="formHorizontalRoomName">
              <Col componentClass={ControlLabel} sm={2}>
                房间名
              </Col>
              <Col sm={10}>
                <FormControl type="text" ref="name"
                             placeholder={this.props.rooms.find(room => room.id === this.props.roomId) && this.props.rooms.find(room => room.id === this.props.roomId).name}/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalInterviewer">
              <Col componentClass={ControlLabel} sm={2}>
                面试官
              </Col>
              <Col sm={10}>
                <FormControl type="email" ref="interviewer"
                             placeholder={this.props.rooms.find(room => room.id === this.props.roomId) && this.props.rooms.find(room => room.id === this.props.roomId).interviewer}
                             disabled/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalImage">
              <Col componentClass={ControlLabel} sm={2}>
                LOGO
              </Col>
              <Col sm={10}>
                <input type="file" ref="logo" id="imageLogo" accept="image/*"/>
              </Col>
              <Col xs={6} md={4}>
                <img
                  src={this.props.rooms.find(room => room.id === this.props.roomId) && this.props.rooms.find(room => room.id === this.props.roomId).logo}
                  width="100%"/>
              </Col>
            </FormGroup>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="success" onClick={this.onEditRoomClick}>保存</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ModifyModal.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  modifyRoom: PropTypes.func,
  roomId: PropTypes.string,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {modifyRoom})(ModifyModal);
