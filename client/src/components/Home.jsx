import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home(){

    const [users, setUsers] = useState([]); 
    const [profileInfo, setProfileInfo] = useState({first_name: ""});

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
            setError(error.message); 
          }
        };

    // GET PROFILE INFO HERE
    const getProfile = async () => {
      try {
        const { data } = await axios("/api/users/profile", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setProfileInfo(data);
      } catch (error) {
        setError(error.message); 
      }
    };
    
     //moveout 
      const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Moving out will remove you and return your items ");
        if (!confirmDelete) return;
    
        try {
          
          const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
          });
    
          if (response.ok) {
            setUsers(users.filter((user) => user.id !== userId));
          } else {
            alert("Failed to delete the user.");
          }
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

          <h3>Hello, {profileInfo.first_name}! We live here! </h3>
          <ul>
            {users.map((user) => (
              <li key={user.id}style={{ marginBottom: "20px" }}>
                 <div>
        {user.first_name} {user.last_name} <br />
        <span>Lives on floor: {user.floor}</span> <br />
        <span>Email: {user.email}</span>
        <div style={{ marginTop: "10px" }}>
        <button onClick={() => handleDeleteUser(user.id)}>I'm moving out</button>
        </div>
            
            </div>
              </li>
            ))}
          </ul>
        </>
      );
    }
