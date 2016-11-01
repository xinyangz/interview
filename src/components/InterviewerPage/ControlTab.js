import React, {PropTypes} from 'react';
import {Row, Col, Tab, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import ProblemTable from './ProblemTable';
import {connect} from 'react-redux';
import {loadAllProblems} from '../../actions/problemActions';

// const problems = [
//   {
//     id: "12345",
//     roomId: "2412",
//     type: "choice",
//     content: {
//       title: "这是一道选择题",
//       description: "按M可",
//       option: ["安轨", "赛艇", "吟诗", "拿衣服"]
//     }
//   },
//   {
//     id: "2333",
//     roomId: "2341",
//     type: "blank",
//     content: {
//       title: "这是一道填空题",
//       description: "美国的【】，比你们高到不知道哪里去了"
//     }
//   }
// ];

class ControlTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1
    };
    this.onTabSelect = this.onTabSelect.bind(this);
    this.onAddChoiceClick = this.onAddChoiceClick.bind(this);
  }

  componentWillMount() {
    this.props.loadAllProblems('123');
  }

  onTabSelect(key) {
    if (key > 2)
      key = 1;
    this.setState({key});
  }

  onAddChoiceClick(e) {
    // TODO
  }

  render() {
    return (
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
                  <MenuItem eventKey={3} onClick={this.onAddChoiceClick}>选择题</MenuItem>
                  <MenuItem eventKey={4} onClick={this.onAddChoiceClick}>填空题</MenuItem>
                  <MenuItem>编程题</MenuItem>
                  <MenuItem>简答题</MenuItem>
                </NavDropdown>
              }
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey={1}>
                <ProblemTable problems={this.props.problems} isWaiting={this.props.isWaiting}/>
              </Tab.Pane>
              <Tab.Pane eventKey={2}>
                Tab 2 content
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  }
}

ControlTab.propTypes = {
  problems: PropTypes.array.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  loadAllProblems: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    problems: state.problemStates.problems,
    isWaiting: state.problemStates.isWaiting
  };
}

export default connect(mapStateToProps, {loadAllProblems})(ControlTab);
