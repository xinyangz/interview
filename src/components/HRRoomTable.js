import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Table, Modal, Button, Form, FormControl, FormGroup, Col, ControlLabel} from 'react-bootstrap';
import {deleteRoom, modifyRoom} from '../actions/roomsActions';
import '../styles/hrroomtable.css';

class HRRoomTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {showModal: false, showModify: false, selectedRoom: null};
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.closeModify = this.closeModify.bind(this);
    this.openModify = this.openModify.bind(this);
    this.onDeleteRoomClick = this.onDeleteRoomClick.bind(this);
    this.onEditRoomClick = this.onEditRoomClick.bind(this);
  }

  close() {
    this.setState({showModal: false});
  }

  open(room_id) {
    this.setState({showModal: true, selectedRoom: room_id});
  }

  closeModify() {
    this.setState({showModify: false});
  }

  openModify(room_id) {
    this.setState({showModify: true, selectedRoom: room_id});
  }

  onDeleteRoomClick() {
    this.props.deleteRoom(this.state.selectedRoom);
    this.close();
  }

  onEditRoomClick(event) {
    //alert('Edit room click!');
    event.preventDefault();
    const name = ReactDOM.findDOMNode(this.ref.name).value;
    const room_id = this.state.selectedRoom;
    const roomToChange = this.props.rooms.find(room => room.id === this.state.selectedRoom);
    const nameToChange = {"name": name};
    let newRoom = Object.Assign(roomToChange,nameToChange);
    this.props.modifyRoom({newRoom,room_id});
    this.closeModify();
  }

  render() {
    return(
      <div>
        <Table>
          <tbody>
            {this.props.rooms.map(room =>
              <tr key={room.id}>
                <td>
                  <a className="room-name" onClick={this.onEditRoomClick}>{room.name}</a>
                </td>
                <td>
                  面试官: {room.interviewer} | {room.candidates.length}人
                </td>
                <td>
                  <a className="link" onClick={() => this.openModify(room.id)}>编辑</a> | <a className="link"
                  onClick={() => this.open(room.id)}>删除</a>
                </td>
              </tr>)}
          </tbody>
        </Table>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>确认删除房间？</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={this.close}>取消</Button>
            <Button bsStyle="primary" onClick={this.onDeleteRoomClick}>确认</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showModify} onHide={this.closeModify}>
          <Modal.Header closeButton>
            <Modal.Title>房间信息</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form horizontal>
              <FormGroup controlId="formHorizontalRoomName">
                <Col componentClass = {ControlLabel} sm={2}>
                  房间名
                </Col>
                <Col sm={10}>
                  <FormControl type="text" ref="name" placeholder="目前房间名"/>
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalInterviewer">
                <Col componentClass={ControlLabel} sm={2}>
                  面试官
                </Col>
                <Col sm={10}>
                  <FormControl type="email" ref="interviewer" placeholder="目前面试官" disabled/>
                </Col>
              </FormGroup>

              <FormGroup controlId="formHorizontalImage">
                <Col componentClass={ControlLabel} sm={2}>
                  LOGO
                </Col>
                <Col sm={10}>
                  <input type="file" ref="logo" accept="image/*"/>
                </Col>
                <Col xs={6} md={4}>
                  <img src="https://www.baidu.com/img/bd_logo1.png" width="100%"/>
                </Col>
              </FormGroup>

            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="success" onClick={this.onEditRoomClick}>保存</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

HRRoomTable.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteRoom: PropTypes.func,
  modifyRoom: PropTypes.func
};

function mapStateToProps(state) {
  return {
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {deleteRoom, modifyRoom})(HRRoomTable);
