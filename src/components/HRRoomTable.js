import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table} from 'react-bootstrap';

const HRRoomTable = (props) => {
  return(
    <Table>
      <tbody>
        {props.rooms.map(room =>
          <tr>
            <td>
              {room.name}
            </td>
            <td>
              面试官: {room.interviewer} | {room.candidates.length}人
            </td>
            <td>
              编辑 | 删除
            </td>
          </tr>
        )}

      </tbody>
    </Table>


  );

};

HRRoomTable.propTypes = {
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired
};

function mapStateToProps(state) {
  return {
    rooms: state.rooms
  };
}

export default connect(mapStateToProps)(HRRoomTable);
