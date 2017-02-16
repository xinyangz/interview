import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Modal, Button, Form, FormControl, FormGroup, Col, ControlLabel} from 'react-bootstrap';
import {addRoom} from '../../actions/roomsActions';

export class AddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      progress: []
    };
    this.onSaveRoomClick = this.onSaveRoomClick.bind(this);
    this._renderPreview = this._renderPreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
  }

  handleChange(event) {
    this.setState({progress:[]});
    event.preventDefault();
    let target = event.target;
    let files = target.files;
    let count = this.state.multiple ? files.length : 1;
    for (let i = 0; i < count; i++) {
      files[i].thumb = URL.createObjectURL(files[i]);
    }
    // convert to array
    files = Array.prototype.slice.call(files, 0);
    files = files.filter(function (file) {
      return /image/i.test(file.type);
    });
    this.setState({files: files});
  }

  handleProgress(file, loaded, total, idx) {
    let percent = (loaded / total * 100).toFixed(2) + '%';
    let _progress = this.state.progress;
    _progress[idx] = percent;
    this.setState({ progress: _progress });
  }

  _renderPreview() {
    return this.state.files.map((item) => {
      return (
        <div className="upload-append-list" key={item.thumb}>
          <p>
            <br/>
              <img src={item.thumb} width="100%" />
          </p>
        </div>
      );
    });
  }

  onSaveRoomClick(event) {
    event.preventDefault();
    const name = ReactDOM.findDOMNode(this.refs.name).value;
    const interviewer = ReactDOM.findDOMNode(this.refs.interviewer).value;
    let logo = ReactDOM.findDOMNode(this.refs.logo).files[0];
    let newRoom = {"name": name, "interviewer": interviewer, "candidates":[]};

    let logoOrNot;
    if(logo === undefined) {
      logoOrNot = 0;
    }
    else {
      logoOrNot = 1;
    }

    let image = new FormData();
    image.append('image', logo);

    this.props.addRoom({newRoom,image,logoOrNot});
    this.props.onHide();
    this.setState({files:[]});
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>房间信息</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form horizontal encType="multipart/form-data" method="put" name="roomInfo">
            <FormGroup controlId="formHorizontalRoomName">
              <Col componentClass={ControlLabel} sm={3}>
                房间名
              </Col>
              <Col sm={8}>
                <FormControl type="text" ref="name" placeholder="请输入面试房间名称"/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalInterviewer">
              <Col componentClass={ControlLabel} sm={3}>
                面试官邮箱
              </Col>
              <Col sm={8}>
                <FormControl type="email" ref="interviewer" placeholder="请输入面试官的邮箱地址"/>
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalImage">
              <Col componentClass={ControlLabel} sm={3}>
                LOGO
              </Col>
              <Col sm={8}>
                <input
                  onChange={(v)=>this.handleChange(v)}
                  type="file"
                  ref="logo"
                  id="imageLogo"
                  accept="image/*"
                  multiple={false}/>
              </Col>
              <Col xs={6} md={4}>
                <div>
                  {this._renderPreview()}
                </div>
              </Col>
            </FormGroup>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="success" onClick={this.onSaveRoomClick}>保存</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddModal.propTypes = {
  addRoom: PropTypes.func,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    rooms: state.roomsStates.rooms
  };
}

export default connect(mapStateToProps, {addRoom})(AddModal);
