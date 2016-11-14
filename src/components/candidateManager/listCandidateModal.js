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
    let image = new FormData();
    image.append('logo', ReactDOM.findDOMNode(this.refs.picture).files[0]);
    this.props.listCandidate(image);
    this.props.omHideListCandidateModal();
  }

  render() {
    return (<Modal show={this.props.showListCandidateModal} onHide={this.onListCandidateClick()}>
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
      <Button onClick={this.onListCandidateClick()}>取消</Button>
      <Button bsStyle="primary" onClick={this.onListCandidateClick}>确认</Button>
    </Modal.Footer>
  </Modal>)}
}

ListCandidateModal.propTypes = {
  showListCandidateModal:PropTypes.bool,
  omHideListCandidateModal:PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {listCandidate})(ListCandidateModal);
