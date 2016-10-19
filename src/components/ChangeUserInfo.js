?import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import '../styles/changeuserinfo.css';

var ChangeUserInfo;
ChangeUserInfo = React.createClass({
    render : function() {
        return (
            <div>
                <CIHeadline />
                <ChangedInfo />
            </div>
        )
    }
});

var CIHeadline;
CIHeadline = React.createClass({
    render : function() {
        return (
            <header  style = {{ background: '#3498db'}}>
                <Navbar fixedTop>
                    <Navbar.Header>
                        返回
                    </Navbar.Header>
                </Navbar>
            </header>
        );
    }
});

var ChangedInfo;
ChangedInfo = React.createClass({
    getInitialState : function() {
        return {
            userEmail : "请输入您的邮箱",
            pass  : "请输入您的密码",
            confirmPass : "请确认您的密码",
            orgName : "请输入您的机构名称",
            userName : "请输入联系人姓名",
        };
    },

    emailChange : function(e) {
        this.setState({userEmail: e.target.value});
    },

    passChange : function(e) {
        this.setState({pass: e.target.value});
    },

    confirmPassChange : function(e) {
        this.setState({confirmPass: e.target.value});
    },

    orgNameChange : function(e) {
        this.setState({orgName: e.target.value});
    },

    userNameChange : function(e) {
        this.setState({userName: e.target.value});
    },

    checkInfo : function() {
        if((this.state.email == null) || (this.state.pass == null) || (this.state.confirmPass == null)
            || (this.state.orgName == null) || (this.state.userName == null)) {
            alert("请完善您的信息fuck0");
            return false;
        }
        if(this.state.pass != this.state.confirmPass) {
            alert("密码不一致Fuck1");
            return false;
        }
    },

    handleClick : function() {
        if(this.checkInfo()) {

        }
    },

    render : function () {
        return (
            <div className = "changeUserInfo">
                <div><label style = {{color: '#BEBEBE'}}>修改用户信息</label></div>
                <div><label>工作邮箱:</label></div>
                <div><input id="email" name="email" type="email"
                            value = {this.state.userEmail} onChange={this.emailChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px'}}/></div>
                <div><label>修改密码:</label></div>
                <div><input id="pass" name="password" type="text"
                            value = {this.state.pass} onChange={this.passChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><label>确认密码:</label></div>
                <div><input id="confirmPass" name="confirmPassword" type="text"
                            value = {this.state.confirmPass} onChange={this.confirmPassChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><label>机构名称:</label></div>
                <div><input id="orgName" name="orgName" type="text"
                            value = {this.state.orgName} onChange={this.orgNameChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><label>联系人姓名:</label></div>
                <div><input id="userName" name="userName" type="text"
                            value = {this.state.userName} onChange={this.userNameChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><button type="submit"
                             style ={{backgroundColor: '#00CC50', borderRadius: '15px', width: '500px', height: '40px' }}>提交修改</button></div>
            </div>
        )
    }
});

export default ChangeUserInfo;
