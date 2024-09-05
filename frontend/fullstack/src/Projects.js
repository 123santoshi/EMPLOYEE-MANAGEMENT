import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Projects.css";

const Projects = () => {
  const initialTaskValues = {
    taskname: "",
    owner: "",
    taskstatus: "",
    createddate: new Date().toISOString(),
  };

  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState(initialTaskValues);
  const [viewTasks, setViewTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:7000/users");
      console.log("Response for getting users:", response.data.usernames);
      const data = response.data.usernames;
      setUsers(data);
      console.log("Users:", data);
    } catch (error) {
      console.log("Error while getting the users data", error);
    }
  };

  const getTasks = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/project");
      setViewTasks(response.data);
    } catch (error) {
      console.log("Error while getting the tasks data", error);
    }
  };

  useEffect(() => {
    getUsers();
    getTasks();
  }, []);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      setIsEditing(false);
      setTaskData(initialTaskValues);
    }
  };

  const submitTask = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing task
        await axios.put(`http://localhost:7000/api/project/${editTaskId}`, taskData);
        console.log("Updated Task");
      } else {
        // Create new task
        await axios.post("http://localhost:7000/api/project", taskData);
        console.log("Inserted New Task");
      }
      setTaskData(initialTaskValues); // Reset form
      getTasks(); // Refresh the task list
      setShowForm(false); // Close the form
      console.log("Data submitted successfully");
    } catch (error) {
      console.log("Error while submitting the task data", error);
    }
  };

  const editTask = async (id) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/project/${id}`);
      setTaskData(response.data);
      setEditTaskId(id);
      setIsEditing(true);
      setShowForm(true);
    } catch (error) {
      console.log("Error while fetching the task data", error);
    }
  };


  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:7000/api/project/${id}`);
      console.log("response==",response);
      if (response.status === 200) {
        console.log("Task deleted successfully");
        getTasks();

      } else {
        console.log("Failed to delete the task");
      }
    } catch (error) {
      console.log("Error while deleting the task data", error);
      if (error.response && error.response.status === 404) {
        console.log("Task not found with the given ID");
      } else {
        console.log("An error occurred while deleting the task");
      }
    }
  }
  
  return (
    <div className='project-container'>
      <div className='addtask-div'>
        <button className='addtask-btn' onClick={toggleForm}>
          {isEditing ? "Edit Task" : "Add Task"}
        </button>
      </div>
      {showForm && (
        <div className='task-div'>
          <form className='addtask-form' onSubmit={submitTask}>
            <label>
              <strong>Enter Task Name</strong>
              <input 
                type="text" 
                placeholder='Enter task name' 
                name="taskname" 
                value={taskData.taskname}  
                onChange={handleTaskChange} 
                required 
              />
            </label>
            <label>
              <strong>Task Owner</strong>
              <select name="owner" value={taskData.owner} onChange={handleTaskChange} required>
                <option value="">Select Owner</option>
                {users.map((item, index) => (
                  <option key={index} value={item.username}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <strong>Task Status</strong>
              <select name="taskstatus" value={taskData.taskstatus} onChange={handleTaskChange} required>
                <option value="">Select status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <button type="submit">
              {isEditing ? "Update Task" : "Create Task"}
            </button>
          </form>
        </div>
      )}

      {!showForm && <table className='task-table'>
        <thead>
          <tr className='task-table-header'>
            <th>Taskname</th>
            <th>Owner</th>
            <th>Task Created Date</th>
            <th>Task Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {viewTasks.map((item, index) => (
            <tr key={index}>
              <td>{item.taskname}</td>
              <td>{item.owner}</td>
              <td>{new Date(item.createddate).toLocaleDateString()}</td>
              <td>{item.taskstatus}</td>
              <td>
                <button className="edittask-btn" onClick={() => editTask(item._id)}>Edit Task</button>
                <button className="deletetask-btn" onClick={() => deleteTask(item._id)}>Mark as Completed</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};

export default Projects;
