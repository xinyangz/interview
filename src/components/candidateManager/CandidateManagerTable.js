import React, {PropTypes}from 'react'
import {connect} from 'react-redux';
import {Tabs, Tab, Table, Modal, Button, FormControl, FormGroup, ControlLabel, Form, Col, Image, NavDropdown, MenuItem} from 'react-bootstrap'
import {deleteCandidate, editCandidate} from './CandidateManagerActions'

class CandidateManagerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedCandidate: null,
      showEditModal: false,
      selectedEditCandidate: null,
      nameChange: null,
      emailChange: null,
      phoneChange: null,
      roomChange: null,
      showAddModal: null,
      showListModal: null,
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.closeAddModal = this.closeAddModal.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.closeListModal = this.closeListModal.bind(this);
    this.openListModal = this.openListModal.bind(this);
    this.onDeleteCandidateClick = this.onDeleteCandidateClick.bind(this);
    this.onEditCandidateClick = this.onEditCandidateClick.bind(this);
    this.onAddCandidateClick = this.onEditCandidateClick.bind(this);
    this.onListCandidateClick = this.onEditCandidateClick.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
    this.changePhone = this.changePhone.bind(this);
  }

  changeName(e) {
    this.setState({nameChange: e.target.value});
  }

  changeEmail(e) {
    this.setState({emailChange: e.target.value});
  }

  changeRoom(e) {
    this.setState({roomChange: this.props.rooms.find(room => room.name === e.target.value).id});
  }

  changePhone(e) {
    this.setState({phoneChange: e.target.value});
  }

  close() {
    this.setState({showModal: false});
  }

  open(candidate_id) {
    this.setState({showModal: true, selectedCandidate: candidate_id});
  }

  closeEditModal() {
    this.setState({showEditModal: false});
  }

  openEditModal(candidate) {
    this.setState({showEditModal: true, selectedEditCandidate: candidate,
                    nameChange:candidate.name, emailChange:candidate.email, phoneChange:candidate.phone, roomChange:candidate.roomId});
  }

  closeAddModal() {
    this.setState({showAddModal: false});
  }

  openAddModal() {
    this.setState({showAddModal: true});
  }

  closeListModal() {
    this.setState({showListModal: false});
  }

  openListModal() {
    this.setState({showListModal: true});
  }

  onDeleteCandidateClick() {
    this.props.deleteCandidate(this.state.selectedCandidate);
    this.close();
  }

  onEditCandidateClick() {
    var termCandidate = {
      "id" : this.state.selectedEditCandidate.id,
      "name" : this.state.nameChange,
      "email" : this.state.emailChange,
      "roomId" : this.state.roomChange,
      "phone" : this.state.phoneChange,
      "record" : this.state.selectedEditCandidate.record,
      "status" : this.state.selectedEditCandidate.status,
    };
    this.props.editCandidate(termCandidate);
    this.closeEditModal();
  }

  onAddCandidateClick() {
    this.closeAddModal();
  }

  onListCandidateClick() {
    this.closeListModal();
  }

  render() {
    return (
      <Tabs id="lll" defaultActiveKey={2}>
        <Tab eventKey={1} title="房间管理">nothing</Tab>
        <Tab eventKey={2} title="候选人管理">
          <Table responsive>
            <thead>
            <tr>
              <th>姓名</th>
              <th>邮箱</th>
              <th>手机</th>
              <th>房间</th>
              <th>面试记录</th>
              <th>面试状态</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
              {this.props.candidateManager.map(candidate =>
                <tr key={candidate.id}>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>
                    <FormGroup controlId={candidate.id}>
                      <FormControl componentClass="select" placeholder="select">
                        {this.props.rooms.map(room =>
                          <option key={room.id}>{room.name}</option>)}
                      </FormControl>
                    </FormGroup>
                  </td>
                  <td>
                    <Col xs={5} md={1}>
                      <Image src="../../images/1.png" width={20} height={20}/>
                    </Col>
                    <Col xs={5} md={1}>
                      <Image src="../../images/2.png" width={20} height={20}/>
                    </Col>
                    <Col xs={5} md={1}>
                      <Image src="../../images/3.png" width={15} height={15}/>
                    </Col>
                    <Col xs={5} md={1}>
                      <Image src="../../images/4.png" width={15} height={15}/>
                    </Col>
                    <Col xs={5} md={1}>
                      <Image src="../../images/5.png" width={18} height={18}/>
                    </Col>
                  </td>
                  <td>{candidate.status}</td>
                  <td><a onClick={() => this.openEditModal(candidate)}>编辑</a> | <a onClick={() => this.open(candidate.id)}>删除</a></td>
                </tr>)}

                <Modal show={this.state.showModal} onHide={this.close}>
                  <Modal.Header closeButton>
                    <Modal.Title>确认删除候选人？</Modal.Title>
                    </Modal.Header>
                  <Modal.Footer>
                    <Button onClick={this.close}>取消</Button>
                    <Button bsStyle="primary" onClick={this.onDeleteCandidateClick}>确认</Button>
                  </Modal.Footer>
                </Modal>

              <Modal show={this.state.showEditModal} onHide={this.closeEditModal} style={{width: '800px', margin: '0 auto'}}>
                <Modal.Header closeButton>
                  <Modal.Title>编辑候选人</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form horizontal>
                    <FormGroup controlId="candidateName">
                      <Col componentClass={ControlLabel} sm={3}>候选人姓名</Col>
                      <Col sm={9}><FormControl type="text" placeholder={this.state.nameChange} onChange={this.changeName}/></Col>
                    </FormGroup>

                    <FormGroup controlId="candidateEmail">
                      <Col componentClass={ControlLabel} sm={3}>候选人邮箱</Col>
                      <Col sm={9}><FormControl type="email" placeholder={this.state.emailChange}  onChange={this.changeEmail}/></Col>
                    </FormGroup>

                    <FormGroup controlId="candidatePhone">
                      <Col componentClass={ControlLabel} sm={3}>候选人手机</Col>
                      <Col sm={9}><FormControl type="text" placeholder={this.state.phoneChange}  onChange={this.changePhone}/></Col>
                    </FormGroup>

                    <FormGroup controlId="candidateRoom">
                      <Col componentClass={ControlLabel} sm={3}>候选人房间</Col>
                      <Col sm={9}>
                        <FormControl componentClass="select" placeholder="select"  onChange={this.changeRoom}>
                          {this.props.rooms.map(room =>
                            <option key={room.id}>{room.name}</option>)}
                        </FormControl>
                      </Col>
                    </FormGroup>

                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.closeEditModal}>取消</Button>
                  <Button bsStyle="primary" onClick={this.onEditCandidateClick}>确认</Button>
                </Modal.Footer>
              </Modal>
            </tbody>
          </Table>

          <NavDropdown className="pull-right" title="添加候选人">
            <MenuItem eventKey={1} onClick={this.openAddModal}>添加候选人</MenuItem>
            <MenuItem eventKey={2} onClick={this.openListModal}>导入候选人列表</MenuItem>
          </NavDropdown>

          <Modal show={this.state.showAddModal} onHide={this.closeAddModal} style={{width: '800px', margin: '0 auto'}}>
            <Modal.Header closeButton>
              <Modal.Title>添加候选人</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form horizontal>
                <FormGroup controlId="candidateName">
                  <Col componentClass={ControlLabel} sm={3}>候选人姓名</Col>
                  <Col sm={9}><FormControl type="text" placeholder="请输入候选人姓名（必填）" onChange={this.changeName}/></Col>
                </FormGroup>

                <FormGroup controlId="candidateEmail">
                  <Col componentClass={ControlLabel} sm={3}>候选人邮箱</Col>
                  <Col sm={9}><FormControl type="email" placeholder="请输入候选人邮箱（必填）" onChange={this.changeEmail}/></Col>
                </FormGroup>

                <FormGroup controlId="candidatePhone">
                  <Col componentClass={ControlLabel} sm={3}>候选人手机</Col>
                  <Col sm={9}><FormControl type="text" placeholder="请输入候选人电话（必填）"  onChange={this.changePhone}/></Col>
                </FormGroup>

                <FormGroup controlId="candidateRoom">
                  <Col componentClass={ControlLabel} sm={3}>候选人房间</Col>
                  <Col sm={9}>
                    <FormControl componentClass="select" placeholder="select"  onChange={this.changeRoom}>
                      {this.props.rooms.map(room =>
                        <option key={room.id}>{room.name}</option>)}
                    </FormControl>
                  </Col>
                </FormGroup>

              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeEditModal}>取消</Button>
              <Button bsStyle="primary" onClick={this.onEditCandidateClick}>确认</Button>
            </Modal.Footer>
          </Modal>
        </Tab>
      </Tabs>
    )
  }
}

CandidateManagerTable.PropTypes = {
  candidateManager: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteCandidate: PropTypes.func,
  editCandidate: PropTypes.func,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    candidateManager: state.candidatesStates.candidates,
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {deleteCandidate, editCandidate})(CandidateManagerTable);

