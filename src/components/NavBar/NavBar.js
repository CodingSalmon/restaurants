import React from "react";
import {Link} from 'react-router-dom'

import './NavBar.css'

const NavBar = ({ user, handleLogout }) => {

  return (
    <nav className="nav-bar">
      <div className="nav-wrapper">
        <Link to='/'>Logo</Link>
        <ul className="right">
          <li>
            <Link to={`/search`}>Search</Link>
          </li>
          <li>
            <Link to={`/users`}>All Users</Link>
          </li>
          {user ? 
          <>
            <li>
              <Link to={`/user/${user._id}`}>Welcome, {user.name}</Link>
            </li>
            <li>
              <Link to=" " onClick={handleLogout}>Log Out</Link>
            </li>
          </>
          :<>
            <li>
              <Link to="/login">Log In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;