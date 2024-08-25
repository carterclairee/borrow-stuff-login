import React, { useState} from "react";
import { useNavigate } from "react-router-dom";


export default function Ineed(){
    const [searchTerm, setSearchTerm] = useState("");
    const [itemCount, setItemCount] = useState(null); 
    const [itemName, setItemName] = useState("");
    const [message, setMessage] = useState("");
    //const navigate =useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        //navigate(`/search/${searchTerm}`);

        try {
            const response = await fetch(`api/index/search/${searchTerm}`); //not sure about this !!
            const data = await response.json();

        
            
            if (response.ok) {
              setItemCount(data.count); 
              setItemName(data.item);
              setMessage(data.message);
            } else {
              setItemCount(0);
              setItemName(data.item);
              setMessage("Item not found");
            }
          } catch (error) {
            console.error("Error fetching search results:", error);
            setItemCount(0);
            setItemName(searchTerm)
            setMessage("An error occurred");
          }

    };

    const handleItemClick = () => {
        if (itemCount > 0){
            navigate(`/details/${searchTerm}`);
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


        {itemCount !== null && (
        <p onClick={handleItemClick} style={{ cursor: 'pointer', color: 'blue' }}>
          Currently {itemCount} {itemName}(s) in the house
        </p>
      )}
      {message && <p>{message}</p>}
        </div>
    );
}