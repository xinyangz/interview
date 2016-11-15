import React, {PropTypes} from 'react';
import {HelpBlock, Col, ControlLabel, Modal, Form, FormControl, FormGroup, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {addCandidate} from '../../actions/candidateManagerActions'

class AddCandidateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      nameChange: "",
      emailChange: "",
      phoneChange: "",
      roomChange: "",
      statusChange: "",
    };

    this.onAddCandidateClick = this.onAddCandidateClick.bind(this);

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

    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({nameChange: "",
      emailChange: "",
      phoneChange: "",
      roomChange: "",
      statusChange: "",});
    this.props.onHideCandidateModal();
  }

  getEmailHelpBlock() {
    if(this.getEmailValState() == 'error') {
      return (<Col smOffset={3}><HelpBlock style={{"padding-left" : "16px"}}>请输入正确的邮箱</HelpBlock></Col>);
    }
    return undefined;
  }

  getPhoneHelpBlock() {
    if(this.getPhoneValState() == 'error') {
      return (<Col smOffset={3}><HelpBlock style={{"padding-left" : "16px"}}>请输入正确的电话</HelpBlock></Col>);
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
      this.closeModal();
    }
    else {
      alert("请先完善候选人信息！");
    }
  }

  render() {
    return (
      <Modal show={this.props.showCandidateModal} onHide={this.closeModal} style={{width: '800px', margin: '0 auto'}}>
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
              <Col sm={9}><FormControl type="text" placeholder="请输入候选人电话（必填）" onChange={this.changePhone}/></Col>
              {this.getPhoneHelpBlock()}
            </FormGroup>

            <FormGroup controlId="candidateRoom" validationState='success'>
              <Col componentClass={ControlLabel} sm={3}>候选人状态</Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="未面试" onChange={this.changeStatus}>
                  <option key={0}>未面试</option>
                  <option key={1}>未通过</option>
                  <option key={2}>通过</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup controlId="candidateRoom" validationState='success'>
              <Col componentClass={ControlLabel} sm={3}>候选人房间</Col>
              <Col sm={9}>
                <FormControl componentClass="select" placeholder="select" onChange={this.changeRoom}>
                  {this.props.rooms.map(room =>
                    <option key={room.id}>{room.name}</option>)}
                </FormControl>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal}>取消</Button>
          <Button bsStyle="primary" onClick={this.onAddCandidateClick}>确认</Button>
        </Modal.Footer>
      </Modal>)
  }
}

AddCandidateModal.propTypes = {
  candidateManager: PropTypes.arrayOf(PropTypes.object).isRequired,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
  showCandidateModal:PropTypes.bool,
  onHideCandidateModal:PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    candidateManager: state.candidatesStates.candidates,
    rooms: state.roomsStates.rooms,
  };
}

export default connect(mapStateToProps, {addCandidate})(AddCandidateModal);
