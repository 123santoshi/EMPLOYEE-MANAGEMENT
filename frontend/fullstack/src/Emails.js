import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import axios from 'axios';
import './Emails.css';

const Emails = () => {
  const [emailData, setEmailData] = useState({
    from_email: '',
    to_email: 'support@example.com',  // Default value for the 'to_email' field
    subject: '',
    message: '',
    dateandtime: new Date().toISOString()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value
    });
  };

  const storeEmailData = async (data) => {
    try {
      const response = await axios.post('http://localhost:7000/api/email', data);
      console.log('Email data stored:', response.data);
    } catch (error) {
      console.error('Error storing email data:', error);
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_8rfxefn',       // Service ID
      'template_0ct3ew9',      // Template ID
      emailData,
      'VuJlEKluBiSbejL22'     // User ID
    )
    .then((result) => {
      console.log(result.text);
      alert('Email sent successfully!');
      storeEmailData(emailData); 
      setEmailData({
        from_email: '',
        to_email: 'support@example.com',  // Resetting to the default value
        subject: '',
        message: '',
        dateandtime: new Date().toISOString() // Reset to current date and time
      });
    }, (error) => {
      console.log(error.text);
      alert('Failed to send email.');
    });
  };

  return (
    <div className='emails-container'>
      <h4 className='ticket-heading'>Raise a ticket to the support</h4>
      <div className='email-template'>
        <form onSubmit={sendEmail} className='email-form'>
          <label>
            <strong>From email address</strong>
            <input 
              type="email" 
              name="from_email" 
              placeholder='Enter email id' 
              value={emailData.from_email} 
              onChange={handleChange} 
              required 
            />
          </label>
          <label>
            <strong>To email address</strong>
            <input 
              type="email" 
              name="to_email" 
              placeholder='Enter email id' 
              value={emailData.to_email} 
              readOnly 
            />
          </label>
          <label>
            <strong>Subject</strong>
            <input 
              type="text" 
              name="subject" 
              placeholder='Enter subject' 
              value={emailData.subject} 
              onChange={handleChange} 
              required 
            />
          </label>
          <label>
            <strong>Description</strong>
            <textarea 
              name="message" 
              placeholder='Enter description' 
              value={emailData.message} 
              onChange={handleChange} 
              required 
            />
          </label>
          <button type="submit">Send Email</button>
        </form>
      </div>
    </div>
  );
};

export default Emails;
