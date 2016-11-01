import React, { PropTypes }from 'react';
import {Route, IndexRouter} from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { login } from '../actions/userActions';
import {Form, FormGroup, Col, Checkbox, Button, ControlLabel, Label, FormControl, Panel, Nav, Navbar} from 'react-bootstrap';
import '../styles/loginpage.css'

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.onLoginClicked = this.onLoginClicked.bind(this);
  }

  onLoginClicked(event) {
    event.preventDefault();
    const { login } = this.props;
    const username = ReactDOM.findDOMNode(this.refs.username).value;
    const password = ReactDOM.findDOMNode(this.refs.password).value;
    login({ username, password });
  }

  render() {
    return (
      <div style={{width: '650px', margin: '0 auto'}}>
        <Panel>
          <h3>登录主考方账号</h3>
            <div style={{width: '500px', margin: '0 auto'}}>
              <Form horizontal>
                <FormGroup controlId="formHorizontalEmail">
                  <Col componentClass={ControlLabel} sm={2}>
                    登录账号
                  </Col>
                  <Col sm={8}>
                    <FormControl type="text" ref="username" placeholder="请输入您的用户名"/>
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword">
                  <Col componentClass={ControlLabel} sm={2}>
                    登录密码
                  </Col>
                  <Col sm={8}>
                    <FormControl type="password" ref="password" placeholder="请输入您的密码"/>
                  </Col>
                </FormGroup>

                <FormGroup controlId = "formHorizontalError">
                  <h4>
                    <Label bsStyle="warning">
                      {(this.props.wrongPassword === true) ? "账号或密码错误！" : ""}
                    </Label>
                  </h4>
                </FormGroup>

                <FormGroup>
                  <Col smOffset={2} sm={8}>
                    <Button bsStyle="primary" type="submit" onClick = {this.onLoginClicked}>
                      登录
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </div>
        </Panel>
      </div>
    );
  }
}

LoginPage.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  wrongPassword: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isLogin : state.user.isLogin,
    wrongPassword: state.user.wrongPassword
  };
}

export default connect(mapStateToProps, {login})(LoginPage);

