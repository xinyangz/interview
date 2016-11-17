import React, {PropTypes}from 'react';
import {connect} from 'react-redux';
import {Table, Image} from 'react-bootstrap';
import '../../styles/CandidateManagerPage/candidate-manager-icon.css';

class InterviewerCandidateTable extends React.Component {
  constructor(props) {
    super(props);

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
          <td>{this.props.rooms.find(room => room.id === candidate.roomId) && this.props.rooms.find(room => room.id === candidate.roomId).name}</td>
          <td className="icon">
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/1.png" width={17} height={17} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/2.png" width={17} height={17} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/3.png" width={13} height={13} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/4.png" width={13} height={13} /></a>
            <a href="https://www.baidu.com/" target="_blank"><Image src="../../images/5.png" width={15} height={15} /></a>
          </td>
          <td>{this.setStatusColor(candidate.status)}</td>
        </tr>)}</tbody>);
    }
    return (<tbody><label>暂无候选人</label></tbody>);
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
        </tr>
        </thead>
        {this.checkNull()}
      </Table>
    );
  }
}

InterviewerCandidateTable.propTypes = {
  candidateManager: PropTypes.arrayOf(PropTypes.object).isRequired,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    candidateManager: state.candidatesStates.candidates,
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps)(InterviewerCandidateTable);

