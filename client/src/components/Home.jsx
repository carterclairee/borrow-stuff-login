import React, { useEffect, useState } from "react";

export default function Home(){

    const [users, setUsers] = useState([]); 
    const [error, setError] = useState(null);


    useEffect(() => {
         const fetchUsers = async () => {
          try {
            const response = await fetch("api/users"); 
            if (!response.ok) {
              throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            setUsers(data);  
          } catch (error) {
            setError(error.message); 
          }
        };
    
        fetchUsers();
      }, []);  
    
      
      //if (error) {
        //return <div>Error: {error}</div>;
     // }
    
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
        </div>
      );
    }






       {/* {itemCount !== null && (
          <p onClick={handleItemClick} style={{ cursor: 'pointer', color: 'blue' }}>
            Currently {itemCount} {result.length} {searchTerm}(s) in the house: 
            {result.map((item, index)=>(
                <div key={index}>
                  {item.item} {item.id}{" Belongs to "}{item.first_name_belong}{item.first_name_belong} 
                  <p>{item.free ? "Available" : "Already borrowed by " }{item.borrowed_by_first_name} {item.borrowed_by_last_name}
                  </p> 
                </div>
              ))}
            </p>
          )}
        
        </div>
      );
  }
}
  */ }
