import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Table, Modal, Button} from 'react-bootstrap';
import {deleteProblem} from '../../actions/problemActions';
import EditProblemModal from './EditProblemModal';

const initialState = {showEditModal: false, showDeleteModal: false, selectedProblem: undefined};

class ProblemTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.mapProblemType = this.mapProblemType.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.onDeleteRoomClick = this.onDeleteRoomClick.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
  }

  openDeleteModal(id) {
    this.setState({showDeleteModal:true, selectedProblem:id});
  }

  closeDeleteModal() {
    this.setState({showDeleteModal:false});
  }

  openEditModal(id) {
    this.setState({selectedProblem:id, showEditModal: true});
  }

  closeEditModal() {
    this.setState({showEditModal: false});
  }


  onDeleteRoomClick() {
    this.props.deleteProblem(this.state.selectedProblem);
    this.closeDeleteModal();
  }

  mapProblemType(type) {
    switch (type) {
      case "choice":
        return "选择题";
      case "blank":
        return "填空题";
      case "answer":
        return "简答题";
      case "code":
        return "编程题";
      default:
        return "未知类型";
    }
  }

  render() {
    return (
      <div>
        <Table>
          <tbody>
          {
            this.props.isWaiting ?
              <tr>
                <td>正在读取...</td>
              </tr>
              :
              this.props.problems.length > 0 ?
                this.props.problems.map(problem =>
                  <tr key={problem.id}>
                    <td>
                      <a className="room-name">{problem.content.title}</a>
                    </td>
                    <td>
                      {this.mapProblemType(problem.type)}
                    </td>
                    <td className="aln-right">
                      <a className="tb-link" onClick={() => {this.openEditModal(problem.id);}}>编辑</a> | <a
                      className="tb-link" onClick={() => {this.openDeleteModal(problem.id);}}>删除</a>
                    </td>
                  </tr>)
                :
                <tr>
                  <td>暂无题目</td>
                </tr> }
          </tbody>
        </Table>

        <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
          <Modal.Header closeButton>
            <Modal.Title>确认删除题目？</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={this.closeDeleteModal}>取消</Button>
            <Button bsStyle="primary" onClick={this.onDeleteRoomClick}>确认</Button>
          </Modal.Footer>
        </Modal>

        <EditProblemModal show={this.state.showEditModal} onHide={this.closeEditModal} type="choice"
          selectedProblem={this.state.selectedProblem}/>
      </div>
    );
  }
}


ProblemTable.propTypes = {
  problems: PropTypes.arrayOf(PropTypes.object).isRequired,
  isWaiting: PropTypes.bool.isRequired,
  deleteProblem: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    problems: state.problemStates.problems,
    isWaiting: state.problemStates.isWaiting
  };
}

export default connect(mapStateToProps, {deleteProblem})(ProblemTable);
