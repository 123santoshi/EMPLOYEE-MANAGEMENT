import React, { useState, useEffect} from 'react';
import axios from 'axios';
import "./Teams.css";

//to pass the data across another componeent usig cretae context and provider 
//const TeamsContext = createContext();

const Teams = () => {
  const [teamlist, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/teams");
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleAddTeam = async () => {
    const newTeam = prompt('Enter Team Name');
    if (newTeam) {
      try {
        const response = await axios.post("http://localhost:7000/api/teams", { teamname: newTeam });
        if (response.data.message === "Team added successfully") {
          fetchTeams();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error adding new team:", error);
        alert("Error adding new team");
      }
    }
  };

  const deleteTeam = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/api/teams/${id}`);
      fetchTeams();
    } catch (error) {
      console.error("Error deleting the team:", error);
      alert("Error deleting the team");
    }
  };

  const editTeam = async (id) => {
    const newTeamName = prompt('Enter New Team Name');
    if (newTeamName) {
      try {
        const response = await axios.put(`http://localhost:7000/api/teams/${id}`, { teamname: newTeamName });
        if (response.data.message === "Team updated successfully") {
          fetchTeams();
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error updating team:", error);
        alert("Error updating team");
      }
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    //<TeamsContext.Provider value={teamlist}>
      <div className='teams-container'>
        <div className='add-team'>
          <button onClick={handleAddTeam} className='addteam-btn'>Add Team</button>
        </div>
        <table className='teams-table'>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamlist.length ? (
              teamlist.map((team) => (
                <tr key={team._id}>
                  <td>{team.teamname}</td>
                  <td>
                    <button className='btn btn-info' onClick={() => editTeam(team._id)}>Edit</button>
                    <button className='btn btn-danger' onClick={() => deleteTeam(team._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No teams available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    //</TeamsContext.Provider>
  );
};

export default Teams;
//export { TeamsContext };
