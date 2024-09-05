import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './Home';
import Users from './Users';
import Addedit from './Addedit';
import Teams from './Teams';
import HR from './HR';
import Hrdetails from './Hrdetails';
import Emails from './Emails';
import Tickets from './Tickets';
import Projects from './Projects';
import Signup from './Signup';
import Login from './Login';

function AppRoutes() {
  const location = useLocation();
  const hideHome = location.pathname === '/' || location.pathname === '/login' ;

  return (
    <>
      {!hideHome && <Home />} 
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home">
          <Route index element={<Navigate to="users" />} />
          <Route path="users" element={<Users />} />
          <Route path="teams" element={<Teams />} />
          <Route path="projects" element={<Projects />} />
          <Route path="hr/details/:id" element={<Hrdetails />} />
          <Route path="addedit" element={<Addedit />} />
          <Route path="hr" element={<HR />} />
          <Route path="addedit/:id" element={<Addedit />} />
          <Route path="teams/:id" element={<Teams />} />
          <Route path="emails" element={<Emails />} />
          <Route path="tickets" element={<Tickets />} />
        </Route>
        <Route path="*" element={<Navigate to="/home/users" />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
