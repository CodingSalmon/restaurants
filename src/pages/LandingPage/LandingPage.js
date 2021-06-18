import React from "react";
import {Link} from 'react-router-dom'

import './LandingPage.css'

const LandingPage = () => {

  return (
    <div className='LandingPage'>
        <h3>Restaurants</h3>
        <h5>Search for restaurants by city or name.</h5>
        <h5>Create and account and save your favorite restaurants!</h5>
    </div>
  );
};

export default LandingPage;