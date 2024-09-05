import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Users.css";
import { Link } from 'react-router-dom';
//import { TeamsContext } from './Teams';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [filterList, setFilterList] = useState([]);
  const [sortKey, setSortKey] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');
  //const [teams,setTeam] = useState([]);

  //const teams = useContext(TeamsContext);

  // Get users list
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:7000/get-data");
      const userData = response.data;
      setUsers(userData);
      setFilterList(userData);
      toast.success("Users data fetched successfully!");
    } catch (error) {
      toast.error("Error fetching data!");
      console.error("Error fetching data:", error);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/${id}`);
      setUsers(users.filter(item => item.empID !== id));
      setFilterList(filterList.filter(item => item.empID !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user!");
      console.error("Error deleting user:", error);
    }
  };

  // Search the data
  const searchData = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchItem(value);
    const filtered = users.filter(user =>
      (user.name && user.name.toLowerCase().includes(value)) ||
      (user.username && user.username.toLowerCase().includes(value)) ||
      (user.empID && user.empID.toString().includes(value)) ||
      (user.reportingHeadName && user.reportingHeadName.toLowerCase().includes(value))
    );
    setFilterList(filtered);
  };

  // Sort data in ascending order
  const sortAsc = (column) => {
    const sortedData = [...filterList].sort((a, b) => {
      if (a[column] < b[column]) {
        return -1;
      }
      if (a[column] > b[column]) {
        return 1;
      }
      return 0;
    });
    setFilterList(sortedData);
  };

  // Sort data in descending order
  const sortDesc = (column) => {
    const sortedData = [...filterList].sort((a, b) => {
      if (a[column] < b[column]) {
        return 1;
      }
      if (a[column] > b[column]) {
        return -1;
      }
      return 0;
    });
    setFilterList(sortedData);
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortKey === 'asc') {
      sortAsc(column);
      setSortKey('desc');
    } else {
      sortDesc(column);
      setSortKey('asc');
    }
    setSortColumn(column);
  };

 
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="top-header">
        <Link to='/addedit'>
          <button className='adduser-btn'>Add User</button>
        </Link>
        <h2>Purchased 0 used {filterList.length}</h2>
        <input 
          type="text" 
          placeholder='Search' 
          name="searchItem"  
          value={searchItem} 
          onChange={searchData} 
          className='search-input'
        />
      </div>
      <div className='users_data'>
        {users.length > 0 ? (
          <table className='users-table'>
            <thead>
              <tr>
                <th onClick={() => handleSort('empID')}>Emp ID</th>
                <th onClick={() => handleSort('name')}>Name</th>
                <th onClick={() => handleSort('username')}>Username</th>
                <th onClick={() => handleSort('reportingHeadName')}>Reportee Head</th>
                <th>Teams</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterList.map((item, index) => (
                <tr key={index}>
                  <td>{item.empID}</td>
                  <td>{item.name}</td>
                  <td>{item.username}</td>
                  <td>{item.reportingHeadName}</td>
                  <td>{item.teams}</td>
                  <td>
                    <Link to={`/addedit/${item.empID}`}><button className='btn btn-primary'>Edit</button></Link>
                    <button className='btn btn-danger' onClick={() => deleteUser(item.empID)}>Delete</button>  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default Users;
