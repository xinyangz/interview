import React, {PropTypes}from 'react'
import {connect} from 'react-redux';
import {Table, Modal, Button, FormControl, FormGroup, ControlLabel, Form, Col, Image, HelpBlock} from 'react-bootstrap'
import {deleteCandidate, editCandidate, addCandidate} from '../../actions/candidateManagerActions'
import '../../styles/CandidateManagerPage/candidate-manager-icon.css'

class CandidateManagerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedCandidate: null,
      showEditModal: false,
      selectedEditCandidate: {},
      nameChange: "",
      emailChange: "",
      phoneChange: "",
      roomChange: "",
      statusChange: "",
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);

    this.onDeleteCandidateClick = this.onDeleteCandidateClick.bind(this);
    this.onEditCandidateClick = this.onEditCandidateClick.bind(this);

    this.getPhoneHelpBlock = this.getPhoneHelpBlock.bind(this);
    this.getEmailHelpBlock = this.getEmailHelpBlock.bind(this);

    this.changeName = this.changeName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.changeStatus = this.changeStatus.bind(this);

    this.checkNull = this.checkNull.bind(this);
    this.setStatusColor = this.setStatusColor.bind(this);
  }

  setStatusColor(status) {
    if(status == "未通过") {
      return (<label style={{color:"#FF0080"}}>未通过</label>);
    }
    else if(status == "通过") {
      return (<label style={{color:"#28FF28"}}>通过</label>);
    }
    else {
      return (<label style={{color:"##000000"}}>未面试</label>);
    }
  }

  checkNull() {
    if(this.props.candidateManager.length) {
      return (<tbody>{this.props.candidateManager.map(candidate =>
        <tr key={candidate.id}>
          <td>{candidate.name}</td>
          <td>{candidate.email}</td>
          <td>{candidate.phone}</td>
          <td>{this.props.rooms.find(room => room.id === candidate.roomId).name}</td>
          <td className="icon">
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/1.png" width={17} height={17} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/2.png" width={17} height={17} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/3.png" width={13} height={13} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/4.png" width={13} height={13} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/5.png" width={15} height={15} /></a>
          </td>
          <td>{this.setStatusColor(candidate.status)}</td>
          <td><a onClick={() => this.openEditModal(candidate)}>编辑</a> | <a onClick={() => this.open(candidate.id)}>删除</a></td>
        </tr>)}</tbody>);
    }
    return (<tbody><label>暂无候选人</label></tbody>);
  }

  getEmailHelpBlock() {
    const length = this.state.emailChange.length;
    if (length > 0)
    {
      const pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if(pattern.test(this.state.emailChange)) {
        return undefined;
      }
      return (<HelpBlock>请输入正确的邮箱</HelpBlock>);
    }
  }

  getPhoneHelpBlock() {
    const length = this.state.phoneChange.length;
    if (length > 0)
    {
      const pattern = /^([0-9])+/;
      if(pattern.test(this.state.phoneChange)) {
        return undefined;
      }
      return (<HelpBlock>请输入正确的电话</HelpBlock>);
    }
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
    console.log(termCandidate);
    this.props.editCandidate(termCandidate);
    this.closeEditModal();
  }

  render() {
    return (
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

            {this.checkNull()}

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
                    <Col sm={9}><FormControl type="text" placeholder={this.state.selectedEditCandidate.name} onChange={this.changeName}/></Col>
                  </FormGroup>

                  <FormGroup controlId="candidateEmail">
                    <Col componentClass={ControlLabel} sm={3}>候选人邮箱</Col>
                    <Col sm={9}><FormControl type="email" placeholder={this.state.selectedEditCandidate.email}  onChange={this.changeEmail}/></Col>
                    {this.getEmailHelpBlock()}
                  </FormGroup>

                  <FormGroup controlId="candidatePhone">
                    <Col componentClass={ControlLabel} sm={3}>候选人手机</Col>
                    <Col sm={9}><FormControl type="text" placeholder={this.state.selectedEditCandidate.phone}  onChange={this.changePhone}/></Col>
                    {this.getPhoneHelpBlock()}
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
          </Table>
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

export default connect(mapStateToProps, {deleteCandidate, editCandidate, addCandidate})(CandidateManagerTable);

