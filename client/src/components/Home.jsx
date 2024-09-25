import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Home(){

    const [users, setUsers] = useState([]); 
    const [profileInfo, setProfileInfo] = useState(null);

    // To navigate to login after deleting user
    const navigate = useNavigate();

    useEffect(() => {
      fetchUsers();
      getProfile();
    }, []);

    const fetchUsers = async () => {
      try {
        const { data } = await axios("/api/users", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          });

          setUsers(data);  
          } catch (error) {
            console.log(error.message); 
          }
        };

    // Get info for individual who is logged in
    const getProfile = async () => {
      try {
        const { data } = await axios("/api/users/profile", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setProfileInfo(data);
      } catch (error) {
        console.log(error.message); 
      }
    };
    
     //moveout 
      const handleDeleteUser = async () => {
        const confirmDelete = window.confirm("Moving out will remove you and return your items ");
        if (!confirmDelete) return;
    
        try {
          await axios(`/api/users`, {
            method: "DELETE",
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          // Go to login after deleting user
          navigate('/login')
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("An error occurred while trying to delete the user.");
        }
      };

    //move in handled on Postman for now

    return (
        <>
        {!localStorage.getItem("token") && (
          <div className="text-center p-4 alert">Please log in to start borrowing and sharing.</div>
        )}

        {profileInfo && (
          <div>
            <h2>Hello, {profileInfo[0].first_name}! We live here! </h2>

            <div className="m-3">
              <button onClick={handleDeleteUser}>I'm moving out</button>
            </div>

            <ul className="list-group">
              {users.map((user) => (
                <li key={user.id} className="list-group-item">
                  <div>
                    {user.first_name} {user.last_name} <br />
                    <span>Lives on floor: {user.floor}</span> <br />
                    <span>Email: {user.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          )}
        </>
      );
    }
