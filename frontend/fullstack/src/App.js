/*import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Users from './Users';
import Home from './Home';
import Addedit from './Addedit';
import Teams from './Teams';
import HR from './HR';
import Hrdetails from './Hrdetails';
import Emails from './Emails';
import Tickets from './Tickets';
import Projects from './Projects';
import Signup from './Signup';
import Login from './Login';

function App() {
  const location = useLocation();
  const hideHome = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="App">
      <BrowserRouter>
        {!hideHome && <Home />} 
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hr/details/:id" element={<Hrdetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/addedit" element={<Addedit />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/addedit/:id" element={<Addedit />} />
          <Route path="/teams/:id" element={<Teams />} />
          <Route path="/emails" element={<Emails />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;

