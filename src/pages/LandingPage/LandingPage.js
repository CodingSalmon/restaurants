import React from "react";
import {Link} from 'react-router-dom'

import './LandingPage.css'

const LandingPage = ({user}) => {
  return (
    <div className='LandingPage'>
        <h3>Restaurants</h3>
        <h5>Search for restaurants by city or name.</h5>
        {user ? 
        <h5>You are logged in, you can save your favorite restaurants!</h5>
        :
        <h5><Link to='/signup'>Create an account</Link> and save your favorite restaurants!</h5>
        }
    </div>
  );
};

export default LandingPage;