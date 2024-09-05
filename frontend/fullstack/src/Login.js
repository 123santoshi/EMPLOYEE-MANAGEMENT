import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import "./Login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const initialValues = {
    username: "",
    password: ""
  };

  const [loginValues, setLoginValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotPwd, setForgotPwd] = useState(false);
  const [forgotPwdID, setForgotPwdID] = useState("");
  const [updatePwd, setUpdatePwd] = useState("");
  const navigate = useNavigate();

  const submitLoginForm = async (e) => {
    e.preventDefault();
    try {
      const { username, password } = loginValues;
      const response = await axios.get("http://localhost:7000/api/signin");
      const users = response.data;
      const user = users.find((user) => user.username === username);
      
      if (user) {
        if (user.password === password) {
          navigate("/home");
        } else {
          setErrorMessage("Password is incorrect");
        }
      } else {
        setErrorMessage("Entered username is incorrect");
      }
    } catch (error) {
      console.error("Error while login:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  const getID = async (username) => {
    try {
      const response = await axios.get("http://localhost:7000/api/signin");
      const users = response.data;
      const user = users.find((item) => item.username === username);
      console.log("user to get the id==", user);
      if (user) {
        console.log("user idd=", user._id);
        setForgotPwdID(user._id);
      }
    } catch (error) {
      console.error("Error while fetching user ID:", error);
    }
  };

  useEffect(() => {
    if (forgotPwdID) {
      console.log("forgot pwd id set==", forgotPwdID);
    }
  }, [forgotPwdID]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setLoginValues({ ...loginValues, [name]: value });
  };

  const forgotPassword = async (username) => {
    console.log("username ==", username);
    await getID(username);
    setForgotPwd(true);
  };

  const updatePasswordInAPI = async () => {
    try {
      console.log("forgotpwd id==", forgotPwdID);
      const response = await axios.put(`http://localhost:7000/api/signin/${forgotPwdID}`, { password: updatePwd });
      console.log("response from updatepassword in API==", response);
      if (response.status==200) {
        alert("Passowrd updated sucessfully .Click 'OK' to navigate to the login page");
        setForgotPwd(false);
        setUpdatePwd("");
        
      } else {
        setErrorMessage("Failed to update password");
      }
    } catch (error) {
      console.error("Error while updating password:", error);
      setErrorMessage("An error occurred during password update. Please try again.");
    }
  };

  const updatePassword = (e) => {
    const { value } = e.target;
    setUpdatePwd(value);
    console.log("updated pwd==", updatePwd);
  };

  const handleUpdatePasswordSubmit = (e) => {
    e.preventDefault();
    updatePasswordInAPI();
  };

  return (
    <div>
      {forgotPwd ? (
        <form className='forgotpwd-form' onSubmit={handleUpdatePasswordSubmit}>
          <h2 className='login-heading'>Reset password Form</h2><br/><br/>
          <label>
            <strong>Reset Password:</strong><br/>
            <input 
              type="password" 
              placeholder='Enter new password' 
              name="updatePwd" 
              value={updatePwd} 
              onChange={updatePassword} 
              required 
            />
          </label><br/><br/>
          <button type="submit" className='resetpwd-btn'>Reset password</button>
        </form>
      ) : (
        <form className="login-form" onSubmit={submitLoginForm}>
          <h2 className='login-heading'>Login Form</h2><br/>
          <label>
            <strong>Username *:</strong>
            <input 
              type="text" 
              placeholder="Enter username" 
              name="username" 
              value={loginValues.username}
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
              value={loginValues.password} 
              onChange={handleForm} 
              required 
            />
          </label>
          <br />
          <button type="submit">Submit</button>
          <br /><br />
          {loginValues.username && (
            <h3 onClick={() => forgotPassword(loginValues.username)} className='forgotpwd-btn'>Forgot password</h3>
          )}
          <br /><br />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      )}
    </div>
  );
};

export default Login;
