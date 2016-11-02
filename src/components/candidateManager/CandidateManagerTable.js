/**
 * Created by 薛凯韬 on 2016/11/1.
 */
import React, {PropTypes}from 'react'
import {connect} from 'react-redux';
import {Tabs, Tab, Table, Modal, Button, FormControl, FormGroup, ControlLabel} from 'react-bootstrap'
import {deleteCandidate} from './CandidateManagerActions'

class CandidateManagerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedCandidate: null,
      showEditModal: false,
      selectedEditCandidate: null
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.onDeleteCandidateClick = this.onDeleteCandidateClick.bind(this);
    this.onEditCandidateClick = this.onEditCandidateClick.bind(this);
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

  openEditModal(candidate_id) {
    this.setState({showEditModal: true, selectedEditCandidate: candidate_id});
  }

  onDeleteCandidateClick() {
    this.props.deleteCandidate(this.state.selectedCandidate);
    this.close();
  }

  onEditCandidateClick() {
    this.closeEditModal();
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
                  <td>一些图案</td>
                  <td>{candidate.status}</td>
                  <td><a onClick={this.open(candidate.id)}>编辑</a> | <a onClick={() => this.open(candidate.id)}>删除</a></td>
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
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    )
  }
}

CandidateManagerTable.PropTypes = {
  candidateManager: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteCandidate: PropTypes.func,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    candidateManager: state.candidatesStates.candidates,
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {deleteCandidate})(CandidateManagerTable);

