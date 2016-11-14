import React, {PropTypes} from 'react';
import {Row, Col, Tab, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import CandidateManagerTable from './CandidateManagerTable';
import {connect} from 'react-redux';
import AddCandidateModal from './AddCandidateModal'
import ListCandidateModal from './ListCandidateModal'

class CandidateManagerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      showAddModal: false,
      showListModal: false,
    };

    this.onTabSelect = this.onTabSelect.bind(this);

    this.closeAddModal = this.closeAddModal.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.closeListModal = this.closeListModal.bind(this);
    this.openListModal = this.openListModal.bind(this);
  }

  closeAddModal() {
    this.setState({showAddModal: false});
  }

  openAddModal() {
    this.setState({showAddModal: true});
  }

  closeListModal() {
    this.setState({showListModal: false});
  }

  openListModal() {
    this.setState({showListModal: true});
  }

  onTabSelect(key) {
    if (key > 2)
      key = 1;
    this.setState({key});
  }

  render() {
    return (
      <Tab.Container id="tab-container" activeKey={this.state.key} onSelect={this.onTabSelect}>
        <Row>
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey={1}>房间管理</NavItem>
              {
                this.state.key === 1 &&
                <NavDropdown className="pull-right" title="添加房间">
                  <MenuItem eventKey={3} onClick={this.onAddChoiceClick}>添加房间</MenuItem>
                </NavDropdown>
              }
              <NavItem eventKey={2}>候选人管理</NavItem>
              {
              this.state.key === 2 &&
              <NavDropdown className="pull-right" title="添加候选人">
                <MenuItem eventKey={5} onClick={this.openAddModal}>添加候选人</MenuItem>
                <MenuItem eventKey={6} onClick={this.openListModal}>导入候选人列表</MenuItem>
              </NavDropdown>
            }
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey={1}>
                Tab1
              </Tab.Pane>
              <Tab.Pane eventKey={2}>
                <CandidateManagerTable/>
              </Tab.Pane>
            </Tab.Content>

            <AddCandidateModal showCandidateModal={this.state.showAddModal} omHideCandidateModal={this.closeAddModal}/>
            <ListCandidateModal showListCandidateModal={this.state.showListModal} omHideListCandidateModal={this.closeListModal} />

          </Col>
        </Row>
      </Tab.Container>);
  }
}

CandidateManagerPage.PropTypes = {
  candidateManager: PropTypes.arrayOf(PropTypes.object).isRequired,
  rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    candidateManager: state.candidatesStates.candidates,
    rooms: state.roomsStates.rooms,
  };
}

export default connect(mapStateToProps)(CandidateManagerPage);

