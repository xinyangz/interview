import React from 'react';
import {Row, Col, Tab, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import ProblemTable from './ProblemTable';
import ChoiceModal from './AddProblemModal';

class ControlTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      modalShow: false,
      modalType: 'choice'
    };
    this.onTabSelect = this.onTabSelect.bind(this);
    this.choiceClose = () => {this.setState({modalShow: false});};
  }

  onTabSelect(key) {
    if (key > 2)
      key = 1;
    this.setState({key});
  }

  render() {
    return (
      <div>
        <Tab.Container id="tab-container" activeKey={this.state.key} onSelect={this.onTabSelect}>
          <Row>
            <Col sm={12}>
              <Nav bsStyle="tabs">
                <NavItem eventKey={1}>
                  面试题目
                </NavItem>
                <NavItem eventKey={2}>
                  候选人名单
                </NavItem>
                {
                  this.state.key === 1 &&
                  <NavDropdown className="pull-right" title="添加面试题">
                    <MenuItem eventKey={3} onClick={() => {this.setState({modalShow: true, modalType: 'choice'});}}>选择题</MenuItem>
                    <MenuItem eventKey={4} onClick={() => {this.setState({modalShow: true, modalType: 'blank'});}}>填空题</MenuItem>
                    <MenuItem eventKey={5} onClick={() => {this.setState({modalShow: true, modalType: 'code'});}}>编程题</MenuItem>
                    <MenuItem eventKey={6} onClick={() => {this.setState({modalShow: true, modalType: 'answer'});}}>简答题</MenuItem>
                  </NavDropdown>
                }
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content animation>
                <Tab.Pane eventKey={1}>
                  <ProblemTable/>
                </Tab.Pane>
                <Tab.Pane eventKey={2}>
                  Tab 2 content
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        <ChoiceModal show={this.state.modalShow} onHide={this.choiceClose} type={this.state.modalType}/>
      </div>
    );
  }
}


export default ControlTab;
