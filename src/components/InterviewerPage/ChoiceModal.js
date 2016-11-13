import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Modal, Button, FormGroup, ControlLabel, FormControl, InputGroup, HelpBlock} from 'react-bootstrap';
import {addChoiceProblem} from '../../actions/problemActions';

const OptionControl = ({checked, content, onContentChange, onCheckedChange, onDelete}) => {
  return (
    <InputGroup>
      <InputGroup.Addon>
        <input type="checkbox" checked={checked} onChange={onCheckedChange}/>
      </InputGroup.Addon>
      <FormControl type="text" value={content || ''} onChange={onContentChange}/>
      <InputGroup.Button>
        <Button onClick={onDelete}>删除</Button>
      </InputGroup.Button>
    </InputGroup>
  );
};

OptionControl.propTypes = {
  checked: PropTypes.bool,
  content: PropTypes.string,
  onContentChange: PropTypes.func,
  onCheckedChange: PropTypes.func,
  onDelete: PropTypes.func
};

const initialState = {
  editOptionContent: undefined,
  editOptionChecked: false,
  title: '',
  description: '',
  options: []
};

export class ChoiceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onAddOption = this.onAddOption.bind(this);
    this.onOptionContentChange = this.onOptionContentChange.bind(this);
    this.onOptionCheckedChange = this.onOptionCheckedChange.bind(this);
    this.onOptionDelete = this.onOptionDelete.bind(this);
    this.getHelpBlock = this.getHelpBlock.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
  }

  onAddOption() {
    this.setState({options: [...this.state.options,
      {
        id: this.state.options.length,
        checked: this.state.editOptionChecked,
        content: this.state.editOptionContent
      }]});
    this.setState({
      editOptionChecked: false,
      editOptionContent: '',
    });
  }

  onOptionContentChange(id) {
    return (e) => {
      this.setState({
        options: [
          ...this.state.options.slice(0, id),
          {
            id: id,
            content: e.target.value,
            checked: this.state.options[id].checked
          },
          ...this.state.options.slice(id + 1)
        ]
      });
    };
  }

  onOptionCheckedChange(id) {
    return () => {
      this.setState({
        options: [
          ...this.state.options.slice(0, id),
          {
            id: id,
            content: this.state.options[id].content,
            checked: !this.state.options[id].checked
          },
          ...this.state.options.slice(id + 1)
        ]
      });
    };
  }

  onOptionDelete(id) {
    return () => {
      this.setState({
        options: [
          ...this.state.options.slice(0, id),
          ...this.state.options.slice(id + 1).map(option => {
            return {
              id: option.id - 1,
              checked: option.checked,
              content: option.content
            };
          })
        ]
      });
    };
  }

  getValidationState () {
    if (this.state.editOptionContent && this.state.editOptionContent.length > 0 &&
      this.state.options.find(option => option.content === this.state.editOptionContent) != undefined)
      return 'error';
  }

  getHelpBlock() {
    if (this.getValidationState() === 'error')
      return (
        <HelpBlock>此选项与已有选项重复</HelpBlock>
      );
    else
      return undefined;
  }

  disableSave() {
    return this.state.title === undefined || this.state.title.length === 0 ||
      this.state.description === undefined || this.state.description.length === 0 ||
      this.state.options.length === 0;
  }

  onSaveClick() {
    // TODO: fetch roomId from store
    const roomId = 123;
    const problemOptions = this.state.options.map(option => {
      return {
        content: option.content,
        correct: option.checked
      }
    });
    const problemContent = {
      title: this.state.title,
      description: this.state.description,
      option: problemOptions
    };
    const problemInfo = {
      roomId: roomId,
      type: "choice",
      content: problemContent
    };
    this.props.addChoiceProblem(problemInfo);
    this.setState(initialState);
    this.props.onHide();
  }

  render() {
    return (
      <Modal {...this.props}>
        <Modal.Header closeButton>
          <Modal.Title >题目信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="title">
            <ControlLabel>标题</ControlLabel>
            <FormControl type="text" placeholder="题目标题" value={this.state.title || ''}
              onChange={(e) => {this.setState({title: e.target.value});}}/>
          </FormGroup>
          <FormGroup controlId="description">
            <ControlLabel>题目描述</ControlLabel>
            <FormControl componentClass="textarea" placeholder="在此添加题目描述" style={{height: 200}}
              value={this.state.description || ''} onChange={(e) => {this.setState({description: e.target.value});}}/>
          </FormGroup>
          <FormGroup controlId="add_option" validationState={this.getValidationState()}>
            <ControlLabel>选项</ControlLabel>
            <InputGroup>
              <InputGroup.Addon>
                <input type="checkbox" checked={this.state.editOptionChecked}
                  onChange={() => {this.setState({editOptionChecked: !this.state.editOptionChecked});}}/>
              </InputGroup.Addon>
              <FormControl type="text" placeholder="选项内容"
                           value={this.state.editOptionContent || ''}
                           onChange={(e) => {this.setState({editOptionContent: e.target.value});}}/>
              <InputGroup.Button>
                <Button onClick={this.onAddOption}
                        disabled={this.state.editOptionContent === undefined || this.state.editOptionContent.length === 0
                        ||this.getValidationState() === 'error'}>添加</Button>
              </InputGroup.Button>
            </InputGroup>
            {this.getHelpBlock()}
          </FormGroup>
          {
            this.state.options.length > 0 &&
            <FormGroup>
              <ControlLabel>已添加选项</ControlLabel>

            </FormGroup>
          }
          { this.state.options.length > 0 &&
          this.state.options.map((option) =>
          <OptionControl key={option.id} checked={option.checked} content={option.content}
            onContentChange={this.onOptionContentChange(option.id)}
            onCheckedChange={this.onOptionCheckedChange(option.id)}
            onDelete={this.onOptionDelete(option.id)}/>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary"
            disabled={this.disableSave()}
            onClick={this.onSaveClick}>保存</Button>
          <Button onClick={this.props.onHide}>关闭</Button>
        </Modal.Footer>
      </Modal>

    );
  }
}

ChoiceModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  addChoiceProblem: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    // TODO: fetch roomId from store
  };
}

export default connect(mapStateToProps, {addChoiceProblem})(ChoiceModal);
