import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ItemDetails() {
  const { item } = useParams();
  const [itemDetails, setItemDetails] = useState([]);


  const getItemDetails = async () => {
    try {
      const response = await fetch(`/api/index/details/${item}`);
      const data = await response.json();
      setItemDetails(data);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  useEffect(() => {
    getItemDetails();
  }, [item]);


  return (

    <div>
    <h2> {item}</h2>
    
          <p>The following people have {item}(s) in the house</p>
          {itemDetails.length > 0 ? (
        itemDetails.map((detail, index) => (
          <div key={index}>
            <p>Name: {detail.first_name} {detail.last_name}</p>
            <p>Email: {detail.email}</p>
            <p>Floor: {detail.floor}</p>
          </div>
        ))
      ) : (
        <p>No one has this item in the house.</p>
      )}
        
    </div>


  );
      
}