import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home(){

    const [users, setUsers] = useState([]); 
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(""); 
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [floor, setFloor] = useState("");


    useEffect(() => {
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
        
        fetchUsers();
      }, []);  
    
    
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
    
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const fullName = `${firstName}.${lastName}`.toLowerCase();
        const email = `${fullName}@mvp.com`;
    
        const personData = {
          first_name: firstName,
          last_name: lastName,
          floor: floor,
          email: email,
        };
    
        try {
          // First, check if the person already exists
          const personResponse = await fetch("/api/users/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: personData.email }),
          });
    
          let personId;
    
          if (personResponse.status === 200) {
            const existingPerson = await personResponse.json();
            personId = existingPerson.id;
            setMessage("User already exists!");
          } else if (personResponse.status === 404) {
            // If person doesn't exist, create a new one
            const newPersonResponse = await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(personData),
            });
    
            const newPerson = await newPersonResponse.json();
            personId = newPerson.id;
            setUsers((prevUsers) => [...prevUsers, newPerson]); // Add the new person to the list
            setMessage("New person added successfully!");
          }
    
          setFirstName("");
          setLastName("");
          setFloor("");
        } catch (error) {
          alert("Error: " + error.message);
        }
      };



    return (
        <div>
          <h3>We live here! </h3>
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

          <form onSubmit={handleSubmit}>
        <h2>Moving in?</h2>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Floor:
          <select value={floor} onChange={(e) => setFloor(e.target.value)} required>
            {[...Array(10).keys()].map((number) => (
              <option key={number + 1} value={number + 1}>
                {number + 1}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <button type="submit">I'm moving in</button>
      </form>
        </div>
      );
    }
