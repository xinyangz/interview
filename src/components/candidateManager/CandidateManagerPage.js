import React, {PropTypes} from 'react';
import {Row, Col, Tab, Nav, NavItem, NavDropdown, MenuItem, ControlLabel, Modal, Form, FormControl, FormGroup, Button} from 'react-bootstrap';
import CandidateManagerTable from './CandidateManagerTable';
import {connect} from 'react-redux';
import {addCandidate, listCandidate} from '../../actions/candidateManagerActions'
import ReactDOM from 'react-dom';

class CandidateManagerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      nameChange: "",
      emailChange: "",
      phoneChange: "",
      roomChange: "",
      statusChange: "",
      showAddModal: false,
      showListModal: false,
    };

    this.onTabSelect = this.onTabSelect.bind(this);

    this.closeAddModal = this.closeAddModal.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.closeListModal = this.closeListModal.bind(this);
    this.openListModal = this.openListModal.bind(this);

    this.onAddCandidateClick = this.onAddCandidateClick.bind(this);
    this.onListCandidateClick = this.onListCandidateClick.bind(this);

    this.changeName = this.changeName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  changeStatus(e) {
    this.setState({statueChange: e.target.value});
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

  onListCandidateClick() {
    let image = new FormData();
    image.append('logo', ReactDOM.findDOMNode(this.refs.picture).files[0]);
    this.props.listCandidate(image);
    this.closeListModal();
  }

  onAddCandidateClick() {
    var termCandidate = {
      "name" : this.state.nameChange,
      "email" : this.state.emailChange,
      "roomId" : this.state.roomChange,
      "phone" : this.state.phoneChange,
      "status" : this.state.statusChange,
    };
    console.log(termCandidate);
    this.props.addCandidate(termCandidate);
    this.closeAddModal();
  }

  onTabSelect(key) {
    if (key > 2)
      key = 1;
    this.setState({key});
  }

  render() {
    return (
      <Tab.Container id="tab-container" activeKey={this.state.key} onSelect={this.onTabSelect}>
        <Row>
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey={1}>房间管理</NavItem>
              {
                this.state.key === 1 &&
                <NavDropdown className="pull-right" title="添加房间">
                  <MenuItem eventKey={3} onClick={this.openAddModal}>添加候选人</MenuItem>
                  <MenuItem eventKey={4} onClick={this.openListModal}>导入候选人列表</MenuItem>
                </NavDropdown>
              }
              <NavItem eventKey={2}>候选人管理</NavItem>
              {
              this.state.key === 2 &&
              <NavDropdown className="pull-right" title="添加候选人">
                <MenuItem eventKey={5} onClick={this.openAddModal}>添加候选人</MenuItem>
                <MenuItem eventKey={6} onClick={this.openListModal}>导入候选人列表</MenuItem>
              </NavDropdown>
            }
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey={1}>
                Tab1
              </Tab.Pane>
              <Tab.Pane eventKey={2}>
                <CandidateManagerTable/>
              </Tab.Pane>
            </Tab.Content>
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
                    <Col componentClass={ControlLabel} sm={3}>候选人状态</Col>
                    <Col sm={9}>
                      <FormControl componentClass="select" placeholder="未面试"  onChange={this.changeStatus}>
                        <option key={0}>未面试</option>
                        <option key={1}>未通过</option>
                        <option key={2}>通过</option>
                      </FormControl>
                    </Col>
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
                <Button onClick={this.closeAddModal}>取消</Button>
                <Button bsStyle="primary" onClick={this.onAddCandidateClick}>确认</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.showListModal} onHide={this.closeListModal}>
              <Modal.Header closeButton>
                <Modal.Title>
                  导入候选人列表
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                请下载并编辑
                <a href="https://www.baidu.com/" target="_blank">样例.csv</a>文件，按照其中格式填入候选人信息后上传，并点击导入即可。上传的文件后缀名应为“.csv”或者“.xlsx”，大小不超过500kb。
                <br/>
                <label className="center">
                  <input id='img' type='file' ref="picture" multiple accept='.csv, .xlsx'/>
                </label>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeListModal}>取消</Button>
                <Button bsStyle="primary" onClick={this.onListCandidateClick}>确认</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Tab.Container>);
  }
}

CandidateManagerPage.PropTypes = {
  candidateManager: PropTypes.arrayOf(PropTypes.object).isRequired,
  addCandidate: PropTypes.func,
  listCandidate: PropTypes.func,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    candidateManager: state.candidatesStates.candidates,
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {addCandidate, listCandidate})(CandidateManagerPage);

