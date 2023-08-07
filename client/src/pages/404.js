import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='page-404-container'>
      
        <div className='header'>
            <div className='logoandtitle'>
                <div className="logoimage"></div>  
                <div className="logonameimage"></div>      
		    </div>
            <h1>404 - Page Not Found</h1>
            <Link to="/">Go to Home Page</Link>
            <br></br>
        </div>
    </div>
  );
};
export default NotFoundPage;