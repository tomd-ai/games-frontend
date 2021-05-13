import React from 'react';
import {Link} from 'react-router-dom';


function Header() {
    return (
      <div className="header">
        <Link className="header-item" to="/">Tom Davenport</Link>
        <Link className="header-item" to="/">Return to game list</Link>
      </div>
    );
  }
  
  export default Header;