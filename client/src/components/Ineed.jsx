import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Ineed(){
    // State for borrowable items
    const [freeItems, setFreeItems] = useState([]);
    // State for grabbing search term from user input
    const [searchTerm, setSearchTerm] = useState("");
    // State for 
    const [result, setResult] = useState([]);
  
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
        setSearchTerm("");
        alert(`You have successfully borrowed the item`);

      } catch (error) {
        console.error("Error borrowing item:", error);
        alert(`Error: ${error.message}`);
      }
    };

    const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        const { data, status } = await axios(`api/index/borrowableItems/${searchTerm}`, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
          data: {item: searchTerm}
        });
          
          if (status === 200) {
            setResult(data);
    
          } else {
            setResult([]);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setMessage("An error occurred");
      }
    };

    return (
    <div>
        {!localStorage.getItem("token") && (
          <div className="text-center p-4 alert">Please log in to start borrowing and sharing.</div>
        )}

        <h2>I need</h2>
        <h3 className="pt-2">Choose something to borrow...</h3>
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

        <h3 className="pt-2">Or search for something specific</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              value={searchTerm} 
              type="text" 
              className="form-control" 
              id="floatingInput" 
              onChange= {(e)=>setSearchTerm(e.target.value)}
              placeholder="text"
              required
            />
            <label htmlFor="floatingInput">What do you need?</label>
          </div>

          <div>
            <button className="btn btn-dark" type="submit">Submit</button>
          </div>
        </form>
        
        {result.map((item)=>(
          <div className="mt-2" key={item.id}>
            {item.item} {" with ID "} {item.id}{" Belongs to "}{item.first_name_belong} {item.last_name_belong} 
              <p>{item.free ? (
              <button
                className="btn btn-dark mt-2"
                onClick={()=> handleBorrowItem(item.id)}
              >
              Borrow this item
              </button>
            ): "Already borrowed by " }{item.borrowed_by_first_name} {item.borrowed_by_last_name}
              </p> 
          </div>
        ))}
      </div>
    );
}