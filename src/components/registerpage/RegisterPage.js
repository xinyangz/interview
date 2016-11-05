import React from 'react';
import RegisterInfo from './RegisterInfo';
import * as RegisterActions from '../../actions/registerActions'
import { Panel } from  'react-bootstrap'

class RegisterPage extends React.Component {
    render() {
        return (
            <Panel header={<h3>创建主考方账号</h3>} bsStyle="primary">
              <RegisterInfo
                clickAction={RegisterActions.register}/>
            </Panel>
        )
    }
}

export default RegisterPage;
