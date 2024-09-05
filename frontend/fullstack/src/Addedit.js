import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "./Addedit.css";

const initialData = {
  empID: '',
  username: '',
  name: '',
  reportingHeadName: '',
  teams: '' // Add teams to the initial state
};

const Addedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [teamslist, setTeamlist] = useState([]);
  const [reportees, setReportees] = useState([]);

  const getUsers = async (id) => {
    try {
      const res = await axios.get(`http://localhost:7000/${id}`);
      setFormData(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getTeams = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/teams");
      setTeamlist(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const getReportees = async () => {
    try {
      const res = await axios.get("http://localhost:7000/users");
      setReportees(res.data.usernames);
    } catch (error) {
      console.error("Error while getting the users list:", error);
    }
  };

  useEffect(() => {
    getTeams();
    getReportees();
    if (id) {
      getUsers(id);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:7000/${id}`, formData);
        alert('User updated successfully');
      } else {
        await axios.post('http://localhost:7000', formData);
        alert('User added successfully');
        setFormData(initialData);
      }
      navigate('/users');
    } catch (error) {
      console.error("Error saving user:", error);
      alert('Error saving user');
    }
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <label htmlFor="empID">Employee ID</label>
        <input 
          type="text" 
          id="empID"
          name="empID" 
          value={formData.empID} 
          onChange={handleChange} 
          placeholder='Enter ID' 
          className='addedit-input'
          required
        />
        <label htmlFor="username">Username/Email</label>
        <input 
          type="text" 
          id="username"
          name="username" 
          className='addedit-input'

          value={formData.username} 
          onChange={handleChange} 
          placeholder='Enter Username/Email' 
        />
        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name"
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder='Enter Name'
          className='addedit-input'
 
        />
        <label htmlFor="reportingHeadName">Line Manager</label>
        <select 
          id="reportingHeadName"
          name="reportingHeadName" 
          value={formData.reportingHeadName} 
          onChange={handleChange} 
          className='addedit-input'

        >
          <option value="">Select Line Manager</option>
          {reportees.map((reportee, index) => (
            <option key={index} value={reportee}>{reportee}</option>
          ))}
        </select>
        <label htmlFor="teams">Team</label>
        <select 
          id="teams"
          name="teams" 
          value={formData.teams} 
          onChange={handleChange} 
          className='addedit-input'

        >
          <option value="">Select Team</option>
          {teamslist.map((team, index) => (
            <option key={index} value={team.teamname}>{team.teamname}</option>
          ))}
        </select>
        <button type="submit" className='addorupdate-btn'>{id ? "Update User" : "Add User"}</button>
      </form> 
    </div>
  );
};

export default Addedit;
