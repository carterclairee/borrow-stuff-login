import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Ireturn(){

const [borrowedItems, setBorrowedItems] = useState ([])
const [error, setError] = useState(null);

useEffect (() => {

 const fetchBorrowedItems = async () => {
    try {
        const { data, status } = await axios("/api/index/borrowedItems", {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          }
        });
        if (status === 500) {
            throw new Error("Failed to fetch borrowedItems");
          }

        // This sets borrowedItems as an array {data: [{item1}, {item2}]} but I'm not sure why since it's just an array in Postman.
        setBorrowedItems(data);
        
    } catch (error){
        console.error ("error fetching borrowed items:", error)
    }
 };
 
 fetchBorrowedItems();

}, []);

const handleReturnItem = async (itemId) => {
  try {
    const { data, status } = await axios(`/api/index/return/${itemId}`, {
      method: "PUT",
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      // Send the item id
      data: {id: itemId}
    });
    
    if (status === 200) {
     alert ("Item returned")
 
     setBorrowedItems(data);

    } else {
      console.error("Failed to return item");
    }
  } catch (error) {
    console.error("Error returning item:", error);
  }
};

return (

<div>
  <h2 className = "mb-3">Your Borrowed Items</h2>

  <ul className="list-group">
        {borrowedItems && borrowedItems.data && borrowedItems.data.length > 0 ? (
            borrowedItems.data.map((item) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
              {item.first_name}'s {item.item} {" with ID "} {item.id}

              <button type="button" className="btn btn-dark btn-sm ms-5" onClick={() => handleReturnItem(item.id)}>Return Item</button>
            </li>
          ))
        ) : (
          <p>Items returned.</p>
        )}
  </ul>
</div>
)
}