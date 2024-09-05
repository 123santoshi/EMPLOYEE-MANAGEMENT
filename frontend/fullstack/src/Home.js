import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className='home-container'>
      <div className='left-navbar'>
        <div className='trial-heading'>
          <h1>Employee Data Management</h1>
        </div>
        <div className='nav-items'>
          <ul>
            <li><Link to="/home/users">Users</Link></li>
            <li><Link to="/home/teams">Teams</Link></li>
            <li><Link to="/home/hr">HR</Link></li>
            <li><Link to="/home/emails">Help</Link></li>
            <li><Link to="/home/tickets">Tickets</Link></li>
            <li><Link to="/home/projects">Projects</Link></li>
          </ul>
        </div>
      </div>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
