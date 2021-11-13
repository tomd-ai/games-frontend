import React from 'react';
import {Link, useLocation} from 'react-router-dom';


function Header() {
    const location = useLocation()

    return (
      <div className="header">
        <Link className="header-item" to="/">Tom Davenport</Link>
        {
            location.pathname === "/" ? <></> : <Link className="header-item" to="/">Return to game list</Link>
        }
      </div>
    );
  }
  
  export default Header;