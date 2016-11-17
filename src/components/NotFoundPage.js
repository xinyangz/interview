import React from 'react';
import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div>
      <h3>
        访问未授权
      </h3>
      <Link to="/login"> 去登录 </Link>
    </div>
  );
};

export default NotFoundPage;
