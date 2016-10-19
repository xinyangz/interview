import React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

var RegisterPage;
RegisterPage = React.createClass({
    render : function() {
        return (
            <div>
                <HeadLine />
                <RegisterInfo />
            </div>
        )
    }
});

var HeadLine;
HeadLine = React.createClass({
    render : function() {
        return (
            <header className="navigation">
                <Navbar fixedTop>
                    <Navbar.Header>
                        <Navbar.Brand>
                            TextTalent
                        </Navbar.Brand>
                    </Navbar.Header>

                    <Nav pullRight>
                        <NavItem eventKey={1}>登陆</NavItem>
                        <NavItem eventKey={2}>注册</NavItem>
                    </Nav>
                </Navbar>
            </header>
        );
    }
});

var RegisterInfo;
RegisterInfo = React.createClass({
    render : function () {
        return (
            <div>
                <div><label>创建主考方账号</label></div>
                <div><label>工作邮箱：</label></div>
                <div><input id="email" name="email" type="email"/></div>
                <div><label>登录密码：</label></div>
                <div><input id="pass" name="password" type="password"/></div>
                <div><label>确认密码：</label></div>
                <div><input id="confirmPass" name="confirmPassword" type="password"/></div>
                <div><label>机构名称：</label></div>
                <div><input id="orgName" name="orgName" type="text"/></div>
                <div><label>联系人姓名：</label></div>
                <div><input id="userName" name="userName" type="text"/></div>
                <div><label>验证码：</label></div>
                <div><input id="caf" name="caf" type="text"/></div>
            </div>
        )
    }
});

export default RegisterPage;