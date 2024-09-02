import React, { useState } from "react";

export default function UserItemForm({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [floor, setFloor] = useState("");
  //const [item, setItem] = useState("");

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

   /* const itemData = {
      item: item,
      free: true,
      belongs_to: "",
      borrowed_by: null,
    }; */

    try {
      const personResponse = await fetch("/api/users/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: personData.email }),
      });

      let personId;

      if (personResponse.status === 200) {
        const existingPerson = await personResponse.json();
        personId = existingPerson.id;
      } else if (personResponse.status === 404) {
        const newPersonResponse = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(personData),
        });

        const newPerson = await newPersonResponse.json();
        personId = newPerson.id;
      }

      //itemData.belongs_to = personId;

      /*const itemResponse = await fetch("/api/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (itemResponse.status === 201) {
        alert("Thank you for adding");

        setFirstName("");
        setLastName("");
        setFloor("");
        setItem("");
        */

        if (onSubmit) onSubmit(personId);

        setFirstName("");
        setLastName("");
        setFloor("");
      //} else {
      //  throw new Error("Failed to add item"); }

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Person</h2>
      <label>
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Last Name:
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Floor:
        <select value={floor} onChange={(e) => setFloor(e.target.value)} required>
          {[...Array(10).keys()].map((number) => (
            <option key={number + 1} value={number + 1}>
              {number + 1}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>

    );
}
