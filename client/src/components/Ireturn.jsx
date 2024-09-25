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
        console.log(data);
        // if (!status.ok) {
        //     throw new Error("Failed to fetch borrowedItems");
        //   }
        
        setBorrowedItems(data);
    } catch (error){
        console.error ("error fetching borrowed items:", error)
    }
 };
 
 fetchBorrowedItems();

}, []);

const handleReturnItem = async (itemId) => {
  try {
    const response = await fetch(`/api/index/return/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.ok) {


     /* const filterdItems = borrowedItems.filter((item) => item.id !== itemId);

      setBorrowedItems(filterdItems) 
      console.log(filterdItems) 
      console.log("Item.iD",  item.id)
      console.log("ItemID",  itemId)
*/
     const updatedItems = await response.json();
     console.log("Updated Items:", updatedItems); 
     setBorrowedItems(updatedItems.data);


    } else {
      console.error("Failed to return item");
    }
  } catch (error) {
    console.error("Error returning item:", error);
  }
};




return (

<div>
<h2> Borrowed Items</h2>

<ul>
        {borrowedItems && borrowedItems.data && borrowedItems.data.length > 0 ? (
            borrowedItems.data.map((item) => (
            <li key={item.id}>
              {item.item}{" with ID "} {item.id}
              <div style={{ marginTop: "10px" }}>
              <button onClick={() => handleReturnItem(item.id)}>Return Item</button>
              </div>
            </li>
          ))
        ) : (
          <p>Items returned.</p>
        )}
      </ul>


</div>

)

}
