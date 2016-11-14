import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Table, Modal, Button, Jumbotron, Panel} from 'react-bootstrap';
import {deleteRoom} from '../../actions/roomsActions';
import ModifyModal from './ModifyModal';
import AddModal from './AddModal';
import '../../styles/hrroomtable.css';
import 'babel-polyfill';

class HRRoomTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {showModal: false, showAdd: false, showModify: false, selectedRoom: null};
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onDeleteRoomClick = this.onDeleteRoomClick.bind(this);
    this.onModifyClicked = this.onModifyClicked.bind(this);
    this.onAddClose = () => {this.setState({showAdd: false});};
    this.ModifyClose = () => {this.setState({showModify: false});};
    this.checkNoRoom = this.checkNoRoom.bind(this);
  }

  close() {
    this.setState({showModal: false});
  }

  open(room_id) {
    this.setState({showModal: true, selectedRoom: room_id});
  }

  onAddClicked() {
    this.setState({showAdd: true});
  }

  onModifyClicked(room_id) {
    this.setState({showModify: true, selectedRoom: room_id});
  }

  onDeleteRoomClick() {
    this.props.deleteRoom(this.state.selectedRoom);
    this.close();
  }

  checkNoRoom() {
    if(!this.props.rooms.length) {
      return(
        <div style={{width: '800px', margin: '0 auto'}}>
          <Panel>
            <div style={{width: '168px', margin: '0 auto'}}>
              <p style={{fontSize:'15px'}}>您需要先创建面试房间，</p>
            </div>
            <div style={{width: '260px', margin: '0 auto'}}>
              <p>才可以导入面试候选人并为他们分配房间</p>
            </div>
            <div style={{width: '125px', margin: '0 auto'}}>
              <p><Button bsStyle="primary" onClick={() => this.onAddClicked()}>创建面试房间</Button></p>
            </div>
          </Panel>
        </div>);
    }
    else {
      return (<Table>
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
              <a className="link" onClick={() => this.onModifyClicked(room.id)}>编辑</a> | <a className="link"
                                                                                            onClick={() => this.open(room.id)}>删除</a>
            </td>
          </tr>)}
        </tbody>
      </Table>);
    }
  }

  render() {
    return(
      <div>
        <Button className="addRoom" onClick={() => this.onAddClicked()}>
          添加房间
        </Button>

        {this.checkNoRoom()}

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>确认删除房间？</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={this.close}>取消</Button>
            <Button bsStyle="primary" onClick={this.onDeleteRoomClick}>确认</Button>
          </Modal.Footer>
        </Modal>

        <AddModal show={this.state.showAdd} onHide={this.onAddClose}/>

        <ModifyModal show={this.state.showModify} onHide={this.ModifyClose}
                     rooms={this.props.rooms} roomId={this.state.selectedRoom}/>
      </div>
    );
  }
}

HRRoomTable.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteRoom: PropTypes.func
};

function mapStateToProps(state) {
  return {
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {deleteRoom})(HRRoomTable);
