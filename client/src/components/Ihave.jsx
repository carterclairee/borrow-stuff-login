
import React, {useState}from "react";



function Ihave() {

const [firstName, setFirstName] = useState ("");
const [lastName, setLastName] = useState("");
const [floor, setFloor] = useState("");
const [item, setItem] = useState("");


  
const [errorMessage, setErrorMessage] = useState(null);

const handleSubmit = async (event) => {
    event.preventDefault();

    const fullName = `${firstName}.${lastName}`.toLowerCase();
    const email = `${fullName}@mvp.com`;


    const personData = {
        first_name: firstName,
        last_name: lastName,
        floor: floor,
        email: email,
    };

    const itemData = {
        item: item,
        free: true, 
        belongs_to: "", 
        borrowed_by: null, 
    };

try {
    const personResponse = await fetch ("/api/users/search", 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: personData.email }),
      });

      let personId;

      if (personResponse.status === 200){
        const existingPerson = await personResponse.json();
        personId = existingPerson.id;
      } else if (personResponse.status === 404) {

        setErrorMessage("This email does not exist in our records.");
        return;
        // Removed unreachable code similar to that in Home; not needed here        
      }

      itemData.belongs_to = personId;

      const itemResponse = await fetch("/api/index", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(itemData),

      });

      if (itemResponse.status === 201){
        alert ("Thank you for adding")

        setFirstName("");
        setLastName("");
        setFloor("");
        setItem("");

        
        
        setErrorMessage(null);


      }else{
        throw new Error ("failed to add");
      }

      }catch (error) {
        alert ("error" + error.message);
      }
} ;

return (

    <form onSubmit={handleSubmit}>


      <h2>Person</h2>
        <label>
        First Name:
        <input
        type= "text"
        value= {firstName}
        onChange={(e)=> setFirstName(e.target.value)}
        required />
        </label>
        <br />
        <label>
        Last Name:
        <input
        type= "text"
        value= {lastName}
        onChange={(e)=> setLastName(e.target.value)}
        required />
        </label>
        <br />
        <label>
            Floor:
            <select value={floor} onChange={(e)=> setFloor(e.target.value)} required>
            {[...Array(10).keys()].map((number) => (
                <option key={number + 1} value={number + 1}>
                    {number + 1}
                </option>
             ))}
              </select>
              </label>

              <br /> 

        <h3>Add an item</h3>
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
);


}

export default Ihave;





