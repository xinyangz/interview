import React from 'react';
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
                       è¿”å›
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
            userEmail : "ÇëÊäÈëÄúµÄÓÊÏä",
            pass  : "ÇëÊäÈëÄúµÄÃÜÂë",
            confirmPass : "ÇëÈ·ÈÏÄúµÄÃÜÂë",
            orgName : "»ú¹¹Ãû³Æ",
            userName : "ÁªÏµÈËĞÕÃû",
            caf : "ÇëÊäÈëÓÒ²àÑéÖ¤Âë"
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

    render : function () {
        return (
            <div className = "changeUserInfo">
                <div><label style = {{color: '#BEBEBE'}}>åˆ›å»ºä¸»è?ƒæ–¹è´¦å·</label></div>
                <div><label>å·¥ä½œé‚®ç®±ï¼?</label></div>
                <div><input id="email" name="email" type="email"
                            value = {this.state.userEmail} onChange={this.emailChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px'}}/></div>
                <div><label>ä¿®æ”¹å¯†ç ï¼?</label></div>
                <div><input id="pass" name="password" type="password"
                            value = {this.state.pass} onChange={this.passChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><label>ç¡®è®¤å¯†ç ï¼?</label></div>
                <div><input id="confirmPass" name="confirmPassword" type="password"
                            value = {this.state.confirmPass} onChange={this.confirmPassChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><label>æœºæ„åç§°ï¼?</label></div>
                <div><input id="orgName" name="orgName" type="text"
                            value = {this.state.orgName} onChange={this.orgNameChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><label>è”ç³»äººå§“åï¼š</label></div>
                <div><input id="userName" name="userName" type="text"
                            value = {this.state.userName} onChange={this.userNameChange}
                            style = {{width: '500px', borderRadius: '10px', height: '40px' }}/></div>
                <div><button type="submit"
                             style ={{backgroundColor: '#00CC50', borderRadius: '15px', width: '500px', height: '40px' }}>æäº¤ä¿®æ”¹</button></div>
            </div>
        )
    }
});

export default ChangeUserInfo;
