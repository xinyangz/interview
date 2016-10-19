/**
 * Created by 薛凯韬 on 2016/10/16.
 */
import React from 'react'
import { render } from 'react-dom'

var registerPage = React.createClass({
  render:function()
  {
      return (
        <div>
          <workEmail />
        </div>
    );
  }
});

var workEmail = React.creatClass({
  render:function()
  {
    return (
      <div><label>工作邮箱:</label><input id="username" name="username" type="text"/></div>
    );
  }
});

React.render(<registerPage />, document.getElementById("register"));
