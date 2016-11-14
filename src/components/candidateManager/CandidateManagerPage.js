import React, {PropTypes} from 'react';
import {HelpBlock, Row, Col, Tab, Nav, NavItem, NavDropdown, MenuItem, ControlLabel, Modal, Form, FormControl, FormGroup, Button} from 'react-bootstrap';
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

    this.getNameValState = this.getNameValState.bind(this);
    this.getEmailValState = this.getEmailValState.bind(this);
    this.getPhoneValState = this.getPhoneValState.bind(this);

    this.getEmailHelpBlock = this.getEmailHelpBlock.bind(this);
    this.getPhoneHelpBlock = this.getPhoneHelpBlock.bind(this);
  }

  getEmailHelpBlock() {
    if(this.getEmailValState() == 'error') {
      return (<HelpBlock>请输入正确的邮箱</HelpBlock>);
    }
    return undefined;
  }

  getPhoneHelpBlock() {
    if(this.getPhoneValState() == 'error') {
      return (<HelpBlock>请输入正确的电话</HelpBlock>);
    }
    return undefined;
  }


  getNameValState(){
    const length = this.state.nameChange.length;
    if (length > 0) return 'success';
  }

  getEmailValState(){
    const length = this.state.emailChange.length;
    if (length > 0)
    {
      const pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if(pattern.test(this.state.emailChange)) {
        return 'success';
      }
      return 'error';
    }
  }

  getPhoneValState(){
    const length = this.state.phoneChange.length;
    if (length > 0)
    {
      const pattern = /^([0-9])+/;
      if(pattern.test(this.state.phoneChange)) {
        return 'success';
      }
      return 'error';
    }
  }

  changeStatus(e) {
    this.setState({statusChange: e.target.value});
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
    if(this.getEmailValState() == 'success' && this.getNameValState() == 'success' && this.getPhoneValState() == 'success') {
      let termCandidate = {
        "name" : this.state.nameChange,
        "email" : this.state.emailChange,
        "roomId" : this.state.roomChange,
        "phone" : this.state.phoneChange,
        "status" : this.state.statusChange,
      };
      this.props.addCandidate(termCandidate);
      this.closeAddModal();
    }
    else {
      alert("请先完善候选人信息！");
    }
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
                  <MenuItem eventKey={3} onClick={this.onAddChoiceClick}>选择题</MenuItem>
                  <MenuItem eventKey={4} onClick={this.onAddChoiceClick}>填空题</MenuItem>
                  <MenuItem>编程题</MenuItem>
                  <MenuItem>简答题</MenuItem>
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
                  <FormGroup controlId="candidateName" validationState={this.getNameValState()}>
                    <Col componentClass={ControlLabel} sm={3}>候选人姓名</Col>
                    <Col sm={9}><FormControl type="text" placeholder="请输入候选人姓名（必填）" onChange={this.changeName}/></Col>
                  </FormGroup>

                  <FormGroup controlId="candidateEmail" validationState={this.getEmailValState()}>
                    <Col componentClass={ControlLabel} sm={3}>候选人邮箱</Col>
                    <Col sm={9}><FormControl type="email" placeholder="请输入候选人邮箱（必填）" onChange={this.changeEmail}/></Col>
                    {this.getEmailHelpBlock()}
                  </FormGroup>

                  <FormGroup controlId="candidatePhone" validationState={this.getPhoneValState()}>
                    <Col componentClass={ControlLabel} sm={3}>候选人手机</Col>
                    <Col sm={9}><FormControl type="text" placeholder="请输入候选人电话（必填）"  onChange={this.changePhone}/></Col>
                    {this.getPhoneHelpBlock()}
                  </FormGroup>

                  <FormGroup controlId="candidateRoom"  validationState='success'>
                    <Col componentClass={ControlLabel} sm={3}>候选人状态</Col>
                    <Col sm={9}>
                      <FormControl componentClass="select" placeholder="未面试"  onChange={this.changeStatus}>
                        <option key={0}>未面试</option>
                        <option key={1}>未通过</option>
                        <option key={2}>通过</option>
                      </FormControl>
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="candidateRoom" validationState='success'>
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
    rooms: state.roomsStates.rooms,
  };
}

export default connect(mapStateToProps, {addCandidate, listCandidate})(CandidateManagerPage);

