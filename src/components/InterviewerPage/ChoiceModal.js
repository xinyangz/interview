import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'react-bootstrap';

export class ChoiceModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal {...this.props}>
        <Modal.Header closeButton>
          <Modal.Title >题目信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>body placeholder</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>

    );
  }
}

export default ChoiceModal;
