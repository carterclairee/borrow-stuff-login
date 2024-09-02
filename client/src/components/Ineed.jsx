import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import UserItemForm from "./UserItemForm";


export default function Ineed(){
    const [searchTerm, setSearchTerm] = useState("");
    const [itemCount, setItemCount] = useState(null); 
//    const [itemName, setItemName] = useState("");
//    const [message, setMessage] = useState("");
    const [result, setResult] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const navigate =useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
       // navigate(`/search/${searchTerm}`);

        try {
            const response = await fetch(`api/index/borrowableItems/${searchTerm}`);
            const data = await response.json();

            console.log("DATA", data);
            
            if (response.ok) {
              setResult(data);
              setItemCount(data.length); 
              // setItemName(data.item);
              // setMessage(data.message);
            } else {
              setResult([]);
              setItemCount(0);
              // setItemName(data.item);
              // setMessage("Item not found");
            }
          } catch (error) {
            console.error("Error fetching search results:", error);
            setItemCount(0);
            //setItemName(searchTerm)
            setMessage("An error occurred");
          }

    };

    const handleItemClick = () => {
        if (itemCount > 0){
            navigate(`/details/${searchTerm}`);
        }
    };


    const handleItemSelection = async (userInfo) => {
      if (selectedItemId) {
        try {
          const response = await fetch(`/api/index/${selectedItemId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userInfo.userId }),  // Send user ID to the backend
          });
  
          if (response.ok) {
            const updatedItem = await response.json();
            alert("Item successfully borrowed!");
  
            // Optionally, update the state or navigate to another page
            // Update the local state to reflect that the item is no longer available
            setResult(result.map(item => item.id === updatedItem.id ? updatedItem : item));
          } else {
            throw new Error("Failed to borrow item");
          }
        } catch (error) {
          console.error("Error updating item:", error);
          alert("Failed to borrow the item.");
        }
      }
    };

    return (
    <div>
        <h2>I need</h2>
        <form onSubmit={handleSubmit}>
        <input
        type="text"
        placeholder="What do you need?"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
        </form>


       {/* {itemCount !== null && (
          <p onClick={handleItemClick} style={{ cursor: 'pointer', color: 'blue' }}>
            Currently {itemCount} {result.length} {searchTerm}(s) in the house: */ }
            {result.map((item, index)=>(
              <div key={index}>
                {item.item} {item.id}{" Belongs to "}{item.first_name_belong} {item.last_name_belong} 
                <p>{item.free ? (
              <button
                onClick={() => {
                  setSelectedItemId(item.id);
                }}
              >
                Borrow this item
              </button>
            ): "Already borrowed by " }{item.borrowed_by_first_name} {item.borrowed_by_last_name}
                </p> 
              </div>
            ))}
          
          {selectedItemId && (
        <>
          <h3>Borrow this item:</h3>
          <UserItemForm
            onSubmit={(userInfo) => handleItemSelection((userInfo))}
          />
        </>
      )}
      
      </div>
    );
}
/*
mysql> SELECT Items.* , People.id AS PeopleId, PeopleBorrow.id AS PeopleBorrowId, People.first_name AS first_name_borrow, PeopleBorrow.first_name AS first_name from Items 
LEFT JOIN People ON Items.belongs_to = People.id LEFT JOIN People AS PeopleBorrow ON Items.borrowed_by = PeopleBorrow.id; 



mysql> SELECT Items.* , People.id AS PeopleId, PeopleBorrow.id AS PeopleBorrowId, People.first_name AS first_name_belong, People.last_name AS last_name_belong, PeopleBorrow.first_name AS first_name, PeopleBorrow.last_name AS last_name from Items 
LEFT JOIN People ON Items.belongs_to = People.id LEFT JOIN People AS PeopleBorrow ON Items.borrowed_by = PeopleBorrow.id; 




*/