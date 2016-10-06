import React, {PropTypes} from 'react';
import Navigation from './NavigationBar';


const App = (props) => {
  return (
    <div>
      <Navigation/>
      {props.children}
    </div>
  );
};

App.propTypes = {
  children: PropTypes.element
};

export default App;
