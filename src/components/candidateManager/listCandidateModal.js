import React, {PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {listCandidate} from '../../actions/candidateManagerActions'

class ListCandidateModal extends React.Component {
  constructor(props) {
    super(props);
    this.onListCandidateClick = this.onListCandidateClick.bind(this);
  }

  onListCandidateClick() {
    let candidateList = new FormData();
    candidateList.append('logo', ReactDOM.findDOMNode(this.refs.logo).files[0]);
    this.props.listCandidate(candidateList);
    this.props.onHideListCandidateModal();
  }

  render() {
    return (
      <Modal show={this.props.showListCandidateModal} onHide={this.props.onHideListCandidateModal}>
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
        <input id='list' type='file' ref="logo" multiple accept='.csv, .xlsx'/>
      </label>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={this.props.onHideListCandidateModal}>取消</Button>
      <Button bsStyle="primary" onClick={this.onListCandidateClick}>确认</Button>
    </Modal.Footer>
  </Modal>)}
}

ListCandidateModal.propTypes = {
  showListCandidateModal:PropTypes.bool,
  onHideListCandidateModal:PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {listCandidate})(ListCandidateModal);
