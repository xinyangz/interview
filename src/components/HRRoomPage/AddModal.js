import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Modal, Button, Form, FormControl, FormGroup, Col, ControlLabel} from 'react-bootstrap';
import {addRoom} from '../../actions/roomsActions';

export class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.onSaveRoomClick = this.onSaveRoomClick.bind(this);
  }

  onSaveRoomClick(event) {
    event.preventDefault();
    const name = ReactDOM.findDOMNode(this.refs.name).value;
    const interviewer = ReactDOM.findDOMNode(this.refs.interviewer).value;
    let logo = ReactDOM.findDOMNode(this.refs.logo).files[0];
    let newRoom = {"name": name, "interviewer": interviewer};
    this.props.addRoom({newRoom,logo});
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
                <FormControl type="text" ref="name" placeholder="请输入面试房间名称"/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalInterviewer">
              <Col componentClass={ControlLabel} sm={2}>
                面试官
              </Col>
              <Col sm={10}>
                <FormControl type="email" ref="interviewer" placeholder="请输入面试官的邮箱地址"/>
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
                <img src="" width="100%"/>
              </Col>
            </FormGroup>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="success" onClick={this.onSaveRoomClick}>保存</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddModal.propTypes = {
  addRoom: PropTypes.func,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    rooms: state.roomsStates.rooms,
    newRoomId: state.roomsStates.newRoomId
  };
}

export default connect(mapStateToProps, {addRoom})(AddModal);
