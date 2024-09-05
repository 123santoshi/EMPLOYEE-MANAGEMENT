import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tickets = () => {
  const [emailData, setEmailData] = useState([]);

  const getEmails = async () => {
    try {
      const res = await axios.get("http://localhost:7000/api/email");
      console.log("Response from email db:", res);
      setEmailData(res.data);
    } catch (error) {
      console.log("Error while fetching the data:", error);
    }
  };

  useEffect(() => {
    getEmails();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>From_email</th>
            <th>To_email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Sent Date and Time</th>
          </tr>
        </thead>
        <tbody>
          {emailData.length > 0 ? (
            emailData.map((email, index) => (
              <tr key={index}>
                <td>{email.from_email}</td>
                <td>{email.to_email}</td>
                <td>{email.subject}</td>
                <td>{email.message}</td>
                <td>{email.dateandtime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No emails found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tickets;
