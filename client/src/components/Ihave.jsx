import React, {useState}from "react";
import axios from "axios";

function Ihave() {
// State for item
const [item, setItem] = useState("");

const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Post item for logged in user
      const { status } = await axios("/api/index", {
        method: "POST",
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: { item: item }
      })
      if (status === 201){
        alert ("Thank you for adding")
        setItem("");

      } else {
        throw new Error ("failed to add");
      }
    } catch (error) {
        alert (error.message);
    }
};

return (
<>
  <form onSubmit={handleSubmit}>
    <label>
    Item:
    <input
    type="text"
    value= {item}
    onChange= {(e)=>setItem(e.target.value)}
    required
    />
    </label>
    <br/>
    <div style={{ marginTop: "10px" }}>
    <button type= "submit">Submit</button>
    </div>
  </form>
</>
);
}

export default Ihave;





