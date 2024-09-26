import React, {useState, useEffect}from "react";
import axios from "axios";

function Ihave() {
// State for item input
const [item, setItem] = useState("");
// State for profile items
const [myItems, setMyItems] = useState([]);

useEffect(() => {getMyItems()}, []);

const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Post item for logged in user
      // Status destructured will access response from axios
      const { status } = await axios("/api/index", {
        method: "POST",
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        // Send the item name
        data: { item: item }
      })
      if (status === 201){
        alert ("Thank you for adding")
        setItem("");
        // Refresh view
        getMyItems();
      } else {
        throw new Error ("failed to add");
      }
    } catch (error) {
        alert (error.message);
    }
};

const getMyItems = async () => {
  try {
    const { data } = await axios("/api/users/profile", {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      }
    });
    setMyItems(data);
  } catch (error) {
    console.log(error.message);
  }
};

const deleteItem = async (itemId) => {
  try {
    const { data } = await axios (`/api/index/${itemId}`, {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      data: {item_id: itemId}
    });
    setMyItems(data);
  } catch (error) {
    console.error(error);
  }
}

return (
<>
  {!localStorage.getItem("token") && (
    <div className="text-center p-4 alert">Please log in to start borrowing and sharing.</div>
  )}
 
  <h2>I have something to share</h2>

  <form onSubmit={handleSubmit}>
    <div className="form-floating mb-3">
      <input
        value={item} 
        type="text" 
        className="form-control" 
        id="floatingInput" 
        onChange= {(e)=>setItem(e.target.value)}
        placeholder="text"
        required
      />
      <label htmlFor="floatingInput">Enter item</label>
    </div>

    <div style={{ marginTop: "10px" }}>
      <button type= "submit">Submit</button>
    </div>
  </form>

  <h3 className="mt-4">My items</h3>
  {/* Only show item list if the user has any */}
  {/* Need the myItems[0] otherwise the page will simply crash if user isn't logged in */}
  {myItems[0] && myItems[0].item_id === null ? (
    <p>No items to share for now.</p>
  ) : (
    <ul className="list-group">
    {myItems.map((i) => (
      <li className="list-group-item d-flex" key={i.item_id}>
        <div>
          {i.item}
        </div>
        <div className="m-auto me-2">
        <i
          onClick={() => deleteItem(i.item_id)}
          role="button"
          className="fa-regular fa-trash-can"
          ></i>
        </div>
      </li>
    ))}
  </ul>
  )}

</>
);
}

export default Ihave;