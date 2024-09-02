import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ItemDetails() {
  const { item } = useParams();
  const {state} = useLocation ();
  const navigate = useNavigate ();
  const [itemDetails, setItemDetails] = useState([]);
  const itemCount = state?.itemCount || 0;

  useEffect(() => {
  const getItemDetails = async () => {
    try {
      const response = await fetch(`/api/index/details/${item}`);
      const data = await response.json();
      console.log("Fetched data:", data); 
      setItemDetails(data);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  
    getItemDetails();
  }, [item]);


  const handleBorrowRequest = (itemDetail) => {
    console.log("Navigating with itemDetail:",itemDetail);
    navigate(`/borrow/${itemDetail.id}`, { state: { itemDetail } });
};

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
            <p> {detail.itemCount} {item}(s)</p>
            <p>{detail.item.free}</p>
            <button onClick={() => handleBorrowRequest(detail)}>Can I borrow ?</button>
            
          </div>
        ))
      ) : (
        <p>No one has this item in the house.</p>
      )}
        
    </div>


  );
      
}