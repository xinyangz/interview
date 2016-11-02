/**
 * Created by 薛凯韬 on 2016/11/1.
 */
import React, {PropTypes}from 'react'
import {connect} from 'react-redux';
import {Tabs, Tab, Table, Modal} from 'react-bootstrap'
import {deleteCandidate} from './CandidateManagerActions'

class CandidateManagerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false, selectedCandidate: null};
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onDeleteCandidateClick = this.onDeleteCandidateClick.bind(this);
    this.onEditCandidateClick = this.onEditCandidateClick.bind(this);
  }

  close() {
    this.setState({showModal: false});
  }

  open(candidate_id) {
    this.setState({showModal: true, selectedRoom: candidate_id});
  }

  onDeleteCandidateClick() {
    this.props.deleteCandidate(this.state.selectedCandidate);
    this.close();
  }

  onEditCandidateClick() {
    alert('Edit room click!');
  }

  render() {
    return (
      <Tabs defaultActiveKey={2}>
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
              {this.props.candidates.map(candidate =>
                <tr key={candidate.id}>
                  <td><a>{candidate.name}</a></td>
                  <td><a>{candidate.email}</a></td>
                  <td><a>{candidate.phone}</a></td>
                  <td>Table cell</td>
                  <td>一些图案</td>
                  <td><label style={{color:"#FF7575"}}>未通过</label></td>
                  <td><a onClick={this.onEditCandidateClick}>编辑</a> | <a onClick={() => this.open(candidate.id)}>删除</a></td>
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
  candidates: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteCandidate: PropTypes.func
};

function mapStateToProps(state) {
  return {
    candidates: state.candidatesStates.candidates
  };
}

export default connect(mapStateToProps, {deleteCandidate})(CandidateManagerTable);

