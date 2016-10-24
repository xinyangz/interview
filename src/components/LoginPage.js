import React from 'react';
import {Route, IndexRouter} from 'react-router';
import {Form, FormGroup, Col, Checkbox, Button, ControlLabel, FormControl, Panel, Nav, Navbar} from 'react-bootstrap';
import '../styles/loginpage.css'

var LoginPage;
LoginPage = React.createClass( {
    render: function () {
        return (
            <div>
                <HeadLine />
                <LoginForm />
            </div>
        )
    }
});

var HeadLine;
HeadLine = React.createClass( {
    render: function () {
        return (
            <header style={{background: '#3498db'}}>
                <Navbar fixedTop>
                    <Navbar.Header>
                        注册
                    </Navbar.Header>
                </Navbar>
            </header>
        );
    }
});

var LoginForm;
LoginForm = React.createClass({
    getInitialState : function () {
        return {
            userName : "请输入您的用户名",
            pass : "请输入您的密码",
        };
    },

    render: function () {
        return (
            <div style={{width: '650px', margin: '0 auto'}}>
                <rePanel>
                    <h3>登录主考方账号</h3>
                    <div style={{width: '500px', margin: '0 auto'}}>
                        <Form horizontal>
                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} sm={2}>
                                登录账号
                            </Col>
                            <Col sm={8}>
                                <FormControl type="text" placeholder="请输入您的用户名"/>
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} sm={2}>
                                登录密码
                            </Col>
                            <Col sm={8}>
                                <FormControl type="password" placeholder="请输入您的密码"/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={8}>
                                <Button bsStyle="primary" type="submit">
                                    登录
                                </Button>
                            </Col>
                        </FormGroup>
                        </Form>
                    </div>
                </rePanel>
            </div>
        )
    }
});
/*
 const LoginPage = () => {
 return (

 );
 }
 */
export default LoginPage;
