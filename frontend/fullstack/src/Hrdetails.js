import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Hrdetails.css';

const Hrdetails = () => {
  const { id } = useParams();
  const [singleUser, setSingleUser] = useState(null);
  const [editData, setEditData] = useState(null);

  const getDatabyId = async () => {
    try {
      const res = await axios.get(`http://localhost:7000/${id}`);
      setSingleUser(res.data);
    } catch (error) {
      console.log("Unable to get the data based on id in HR details page", error);
    }
  };

  useEffect(() => {
    if (id) {
      getDatabyId();
    }
  }, [id]);

  const renderValue = (value) => (value === null || value === undefined || value === '') ? "Not Set" : value;

  const handleEdit = (data) => {
    setEditData({ ...data });
  };

  const handleCloseEdit = () => {
    setEditData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`http://localhost:7000/${id}`, editData);
      console.log(res);
      setSingleUser(res.data);
      getDatabyId();
      handleCloseEdit();
    } catch (error) {
      console.log("Unable to save the data", error);
    }
  };

  if (!singleUser) {
    return <div>Loading...</div>;
  }

  if (editData) {
    return (
      <div className='user-profile'>
        <h2 className='edit-heading'>Edit Information</h2>
        <form className='edit-profile' onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <label>
            <strong>Employee ID:</strong>
            <input type="text" name="empID" value={editData.empID || ''} onChange={handleChange} readOnly/>
          </label>
          <label>
            <strong>Employee Name:</strong>
            <input type="text" name="name" value={editData.name || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Department Name:</strong>
            <input type="text" name="departmentName" value={editData.departmentName || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Reportee Head Name:</strong>
            <input type="text" name="reporteeHeadName" value={editData.reporteeHeadName || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Designation:</strong>
            <select name="designation" value={editData.designation || ''} onChange={handleChange}>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Software Developer">Software Developer</option>
              <option value="HR">HR</option>
            </select>
          </label>
          <label>
            <strong>Mobile Number:</strong>
            <input type="tel" name="mobileNumber" value={editData.mobileNumber || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Gender:</strong>
            <label>
              <input type="radio" name="gender" value="male" checked={editData.gender === 'male'} onChange={handleChange} />
              Male
            </label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label>
              <input type="radio" name="gender" value="female" checked={editData.gender === 'female'} onChange={handleChange} />
              Female
            </label>
          </label>
          <label>
            <strong>Alternative Email:</strong>
            <input type="email" name="alternativeEmail" value={editData.alternativeEmail || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>User Email:</strong>
            <input type="email" name="userEmail" value={editData.userEmail || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Date of Birth:</strong>
            <input type="date" name="dateOfBirth" value={editData.dateOfBirth || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Address:</strong>
            <input type="text" name="address" value={editData.address || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Date Of Joining:</strong>
            <input type="date" name="dateOfJoining" value={editData.dateOfJoining || ''} onChange={handleChange} />
          </label>
          <label>
            <strong>Employment Type:</strong>
            <select name="employmentType" value={editData.employmentType || ''} onChange={handleChange}>
              <option value="Intern">Intern</option>
              <option value="Probation">Probation</option>
              <option value="Full Time">Full Time</option>
              <option value="Freelancer">Freelancer</option>
            </select>
          </label>
          <label>
            <strong>Teams:</strong>
            <input type="text" name="teams" value={editData.teams || ''} onChange={handleChange} readOnly/>
          </label>
          <div className='submitandcancel-btn'>
            <button type="submit" className='save-btn'>Save</button>
            <button type="button" className='cancel-btn' onClick={handleCloseEdit}>Cancel</button>
          </div>
         
        </form>
      </div>
    );
  }

  return (
    <div className='user-profile'>
      <div className='edit-button'>
        <button type='button' onClick={() => handleEdit(singleUser)}>Edit Details</button>

      </div>     
      <div className='form-container'>
        <form className='profile' onSubmit={(e) => e.preventDefault()}>
          <div className='edit-heading'>
            <h2 className='profile-heading'>Profile Information</h2>
          </div>
          <label>
            <strong>Employee ID:</strong>
            <input type="text" value={renderValue(singleUser.empID)} readOnly />
          </label>
          <label>
            <strong>Employee Name:</strong>
            <input type="text" value={renderValue(singleUser.name)} readOnly />
          </label>
          <label>
            <strong>Gender:</strong>
            <input type="text" value={renderValue(singleUser.gender)} readOnly />
          </label>
          <label>
            <strong>Department Name:</strong>
            <input type="text" value={renderValue(singleUser.departmentName)} readOnly />
          </label>
          <label>
            <strong>Reportee Head Name:</strong>
            <input type="text" value={renderValue(singleUser.reporteeHeadName)} readOnly />
          </label>
        </form>

        <form className='contact-info' onSubmit={(e) => e.preventDefault()}>
          <div className='edit-heading'>
            <h2 className='profile-heading'>Contact Information</h2>
          </div>
          <label>
            <strong>Official Email:</strong>
            <input type="email" value={renderValue(singleUser.userEmail)} readOnly />
          </label>
          <label>
            <strong>Mobile Number:</strong>
            <input type="tel" value={renderValue(singleUser.mobileNumber)} readOnly />
          </label>
          
          <label>
            <strong>Alternative Email:</strong>
            <input type="email" value={renderValue(singleUser.alternativeEmail)} readOnly />
          </label>
          <label>
            <strong>Date of Birth:</strong>
            <input type="date" value={renderValue(singleUser.dateOfBirth)} readOnly />
          </label>
          <label>
            <strong>Address:</strong>
            <input type="text" value={renderValue(singleUser.address)} readOnly />
          </label>
        </form>

        <form className='job-info' onSubmit={(e) => e.preventDefault()}>
          <div className='edit-heading'>
            <h2 className='profile-heading'>Job Information</h2>
          </div>
          <label>
            <strong>Date Of Joining:</strong>
            <input type="date" value={renderValue(singleUser.dateOfJoining)} readOnly />
          </label>
          <label>
            <strong>Employment Type:</strong>
            <input type="text" value={renderValue(singleUser.employmentType)} readOnly />
          </label>
          <label>
            <strong>Teams:</strong>
            <input type="text" value={renderValue(singleUser.teams)} readOnly />
          </label>
          <label>
            <strong>Designation:</strong>
            <input type="text" value={renderValue(singleUser.designation)} readOnly />
          </label>
        </form>
      </div>
    </div>
  );
};

export default Hrdetails;
