import React from "react";
import { useLocation } from "react-router-dom";

export default function BorrowStatus() {
  const { state } = useLocation();
  console.log("State from location:", state);
  const itemDetail = state?.itemDetail;

  console.log("ItemDetail:", itemDetail);

  if (!itemDetail) {
    return <p>Error: No item detail found.</p>;
  }

  console.log("HERE", state)

  return (
    <div>
      <h2>Borrow Status for {itemDetail.item}</h2>

      <p> {itemDetail.free}</p>

      {itemDetail.borrowed_by ? (
        <p>The {itemDetail.item} is already borrowed by {itemDetail.borrowed_by}.</p>
      ) : (
        <p>The {itemDetail.item} is available for borrowing.</p>
      )}
      
    </div>

  );
}

/* 


{itemDetail.borrowed_by ? (
        <p>The {itemDetail.item} is already borrowed by {itemDetail.borrowed_by}.</p>
      ) : (
        <p>The {itemDetail.item} is available for borrowing.</p>
      )}

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

*/