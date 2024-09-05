import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from 'react-bootstrap';
import axios from 'axios';
import './Hr.css';
import { Link } from 'react-router-dom';

const HR = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:7000/get-data");
      const userData = response.data;
      setData(userData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='card-container'>
      {data.map((item) => (
        <Card key={item.empID} className='card-item'>
          <CardHeader className='card-header'>{item.name}</CardHeader>
          <CardBody className='card-body'>
            <p><strong>Username:</strong> {item.username}</p>
            <p><strong>Employee ID:</strong> {item.empID}</p>
            <p><strong>Reportee Head:</strong> {item.designation}</p>
            <p><strong>Department:</strong> {item.departmentName}</p>
          </CardBody>
          <CardFooter className='card-footer'>
            <Link to={`/hr/details/${item.empID}`}><button className='viewfulldetails-btn'>View Full Details</button></Link> 
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HR;
