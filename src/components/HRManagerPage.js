import React, {PropTypes} from 'react';
import {Row, Col, Tab, Nav, NavItem, NavDropdown, MenuItem, Table, Panel, Button, Modal} from 'react-bootstrap';
import CandidateManagerTable from './candidateManager/CandidateManagerTable';
import {connect} from 'react-redux';
import AddCandidateModal from './candidateManager/AddCandidateModal';
import ListCandidateModal from './candidateManager/listCandidateModal';
import ModifyModal from './HRRoomPage/ModifyModal';
import AddModal from './HRRoomPage/AddModal';
import {deleteRoom} from '../actions/roomsActions';

class CandidateManagerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      showAddCandidateModal: false,
      showListCandidateModal: false,
      showDeleteRoomModal: false,
      showAddRoomModal: false,
      showModifyModal: false,
      selectedRoom: null
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onDeleteRoomClick = this.onDeleteRoomClick.bind(this);
    this.checkNoRoom = this.checkNoRoom.bind(this);

    this.onTabSelect = this.onTabSelect.bind(this);

    this.closeAddCandidateModal = this.closeAddCandidateModal.bind(this);
    this.openAddCandidateModal = this.openAddCandidateModal.bind(this);
    this.closeListCandidateModal = this.closeListCandidateModal.bind(this);
    this.openListCandidateModal = this.openListCandidateModal.bind(this);
    this.openAddRoomModal = this.openAddRoomModal.bind(this);
    this.closeAddRoomModal = this.closeAddRoomModal.bind(this);
    this.openModifyModal = this.openModifyModal.bind(this);
    this.closeModifyModal = this.closeModifyModal.bind(this);
  }

  closeAddCandidateModal() {
    this.setState({showAddCandidateModal: false});
  }

  openAddCandidateModal() {
    this.setState({showAddCandidateModal: true});
  }

  closeListCandidateModal() {
    this.setState({showListCandidateModal: false});
  }

  openListCandidateModal() {
    this.setState({showListCandidateModal: true});
  }

  closeAddRoomModal() {
    this.setState({showAddRoomModal: false});
  }

  openAddRoomModal() {
    this.setState({showAddRoomModal: true});
  }

  closeModifyModal() {
    this.setState({showModifyModal: false});
  }

  openModifyModal(room_id) {
    this.setState({showModifyModal: true, selectedRoom: room_id});
  }

  onTabSelect(key) {
    if (key === 3)
      key = 1;
    else if (key === 4 || key === 5)
      key = 2;
    this.setState({key});
  }

  close() {
    this.setState({showDeleteRoomModal: false});
  }

  open(room_id) {
    this.setState({showDeleteRoomModal: true, selectedRoom: room_id});
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
              <p><Button bsStyle="primary" onClick={this.openAddRoomModal}>创建面试房间</Button></p>
            </div>
          </Panel>
        </div>);
    }
    else {
      return (<Tab.Container id="tab-container" activeKey={this.state.key} onSelect={this.onTabSelect}>
        <Row>
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey={1}>房间管理</NavItem>
              {
                this.state.key === 1 &&
                <NavDropdown className="pull-right" title="添加房间">
                  <MenuItem eventKey={3} onClick={this.openAddRoomModal}>添加房间</MenuItem>
                </NavDropdown>
              }
              <NavItem eventKey={2}>候选人管理</NavItem>
              {
                this.state.key === 2 &&
                <NavDropdown className="pull-right" title="添加候选人">
                  <MenuItem eventKey={4} onClick={this.openAddCandidateModal}>添加候选人</MenuItem>
                  <MenuItem eventKey={5} onClick={this.openListCandidateModal}>导入候选人列表</MenuItem>
                </NavDropdown>
              }
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey={1}>
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
                        <a className="link" onClick={() => this.openModifyModal(room.id)}>编辑</a> | <a className="link"
                                                                                                      onClick={() => this.open(room.id)}>删除</a>
                      </td>
                    </tr>)}
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey={2}>
                <CandidateManagerTable/>
              </Tab.Pane>
            </Tab.Content>

          </Col>
        </Row>
      </Tab.Container>);
    }
  }

  render() {
    return (
      <div>
        {this.checkNoRoom()}
        <AddCandidateModal showCandidateModal={this.state.showAddCandidateModal} onHideCandidateModal={this.closeAddCandidateModal}
                           rooms={this.props.rooms} candidateManager={this.props.candidateManager}/>
        <ListCandidateModal showListCandidateModal={this.state.showListCandidateModal} onHideListCandidateModal={this.closeListCandidateModal} />
        <AddModal show={this.state.showAddRoomModal} onHide={this.closeAddRoomModal}/>
        <ModifyModal show={this.state.showModifyModal} onHide={this.closeModifyModal}
                     rooms={this.props.rooms} roomId={this.state.selectedRoom}/>

        <Modal show={this.state.showDeleteRoomModal} onHide={this.close}>
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

CandidateManagerPage.propTypes = {
  candidateManager: PropTypes.arrayOf(PropTypes.object).isRequired,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteRoom: PropTypes.func
};

function mapStateToProps(state) {
  return {
    candidateManager: state.candidatesStates.candidates,
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {deleteRoom})(CandidateManagerPage);

