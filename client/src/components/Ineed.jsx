import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Ineed(){
    // State for borrowable items
    const [freeItems, setFreeItems] = useState([]);
  
  useEffect(() => {getAvailableItems()}, []);

  // All available items
  const getAvailableItems = async () => {
    try {
      const { data } = await axios("/api/index/borrowableItems", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        }
      });
      setFreeItems(data);
    } catch (error) {
      console.log(error.message);
    }
    };

    const handleBorrowItem = async (itemId) => {
      try {
        const { data, status } = await axios(`/api/index/${itemId}`, {
          method: "PUT",
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          data: itemId
        });
    
        if (status !== 200) {
          console.error("Failed to borrow item");
        };

        setFreeItems(data) // Get the updated items back from the response
        alert(`You have successfully borrowed the item`);

      } catch (error) {
        console.error("Error borrowing item:", error);
        alert(`Error: ${error.message}`);
      }
    };

    return (
    <div>
        {!localStorage.getItem("token") && (
          <div className="text-center p-4 alert">Please log in to start borrowing and sharing.</div>
        )}

        <h2>I need</h2>
        {freeItems.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th className="pe-5" scope="col">Item</th>
              <th className="pe-5" scope="col">Owner</th>
              <th scope="col">Use it</th>
            </tr>
          </thead>
          <tbody>
          {freeItems.map((item) => (
            <tr key={item.id}>
              <td className="pe-5">{item.item}</td>
              <td className="pe-5">{item.first_name} {item.last_name}</td>
              <td>
                <button onClick={()=> handleBorrowItem(item.id)} className="btn btn-dark btn-sm">Borrow</button>
              </td>
            </tr>
              ))}
          </tbody>
        </table>
        )}
      </div>
    );
}