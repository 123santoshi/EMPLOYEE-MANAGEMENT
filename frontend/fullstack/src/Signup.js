import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import "./Signup.css";

const Signup = () => {
  const initialValues = {
    username: "",
    password: ""
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState("");
  const [userExist, setUserExist] = useState(false);

  const navigate = useNavigate(); 

  const submitSignInForm = async (e) => {
    e.preventDefault(); 
    try {
      console.log("Form values to insert:", formValues);
      const response = await axios.post("http://localhost:7000/api/signin", formValues);
      if (response.status === 201) {
        alert("Account created successfully. Please click on 'OK' to navigate to login page");
        navigate("/login"); 
        console.log("navigatd to login page in signin")
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("User already exists. Please click here to ");
        setUserExist(true);
      } else {
        console.error("Error during signup:", error);
        setErrorMessage("An error occurred during signup. Please try again.");
      }
    }
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className='signup-form'>
      <form onSubmit={submitSignInForm}>
        <h1 className='signin-heading'>Signup Form</h1>

        <label>
          <strong>Username:</strong>
          <input 
            type="email" 
            placeholder="Enter username" 
            name="username" 
            value={formValues.username} 
            onChange={handleForm} 
            required 
          />
        </label>
        <br />
        <label>
          <strong>Password:</strong>
          <input 
            type="password" 
            placeholder="Enter Password" 
            name="password" 
            value={formValues.password} 
            onChange={handleForm} 
            required 
          />
        </label>
        <br />
        <button type="submit" className='register-btn'>Register</button><br/>
        {userExist || <h3 className='account-exist'>Already have an account? Click here to <Link to="/login">Login</Link></h3>}
        {errorMessage && <p className="error-message">{errorMessage}<Link to='/login'>Login</Link></p>}
      </form>
    </div>
  );
};

export default Signup;
