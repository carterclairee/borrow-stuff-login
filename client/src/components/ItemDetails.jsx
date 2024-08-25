import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ItemDetails() {
  const { item } = useParams();
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    
    fetch(`api/index/details/${item}`)
      .then((response) => response.json())
      .then((data) => setItemDetails(data))
      .catch((error) => console.error("Error fetching item details:", error));
  }, [item]);

  
  return (

    <div>
    <h2> "{item}"</h2>
    
    <p>Is Free: {itemDetails.free ? "Yes" : "No"}</p>
    <p>Belongs To: {itemDetails.belongs_to}</p>
    <p>Borrowed By: {itemDetails.borrowed_by ? itemDetails.borrowed_by : "Not borrowed"}</p>
    
  </div>


  );
      
}