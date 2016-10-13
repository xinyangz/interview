import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Table, Modal, Button} from 'react-bootstrap';
import {deleteRoom} from '../actions/roomsActions';

class HRRoomTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {showModal: false, selectedRoom: null};
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onDeleteRoomClick = this.onDeleteRoomClick.bind(this);
  }

  close() {
    this.setState({showModal: false});
  }

  open(room_id) {
    this.setState({showModal: true, selectedRoom: room_id});
  }

  onDeleteRoomClick() {
    this.props.deleteRoom(this.state.selectedRoom);
    this.close();
  }

  render() {
    return(
      <div>
        <Table>
          <tbody>
            {this.props.rooms.map(room =>
              <tr key={room.id}>
                <td>
                  {room.name}
                </td>
                <td>
                  面试官: {room.interviewer} | {room.candidates.length}人
                </td>
                <td>
                  <a onClick={() => alert('Edit Room Clicked')}>编辑</a> | <a onClick={() => this.open(room.id)}>删除</a>
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
    rooms: state.rooms
  };
}

export default connect(mapStateToProps, {deleteRoom})(HRRoomTable);
