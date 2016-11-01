import React, {PropTypes} from 'react';
import {Table} from 'react-bootstrap';

const ProblemTable = ({problems}) => {

  const mapProblemType = (type) => {
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
  };

  const onDeleteProblemClick = (e) => {
    console.log(e.target.id);
  };

  return (
    <Table>
      <tbody>
      { problems.length > 0 ?
        problems.map(problem =>
          <tr key={problem.id}>
            <td>
              <a className="room-name">{problem.content.title}</a>
            </td>
            <td>
              {mapProblemType(problem.type)}
            </td>
            <td className="aln-right">
              <a id={problem.id} className="link">编辑</a> | <a
              id={problem.id} className="link" onClick={onDeleteProblemClick}>删除</a>
            </td>
          </tr>)
        :
        <tr>
          暂无题目
        </tr> }
      </tbody>
    </Table>
  );
};

ProblemTable.propTypes = {
  problems: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ProblemTable;
