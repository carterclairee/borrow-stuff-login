import React, { useEffect, useState} from "react";
import {useParams} from "react-router-dom";


export default function SearchResults() {
    const {item} = useParams();
    const [searchResults, setSearchResults] = useState(null);


    useEffect(() => {
        fetch('api/index/borrowableItems/${item}')
        .then((response) => response.json())
        .then((data) => setSearchResults(data))
        .catch((error) => console.error("Error fetching search results", error));
    }, [item]);
    
    if (!searchResults){
        return <div>Loading...</div>
    }

    return (

      <div>
        <h2>Search Results for "{item}"</h2>
        {searchResults.message ? (
          <p>{searchResults.message}</p>
        ) : (
          <div>
            <p>{searchResults.length} Items Found</p>
            {searchResults.length > 0 ? (
              <p>Found Stuff!</p>
            ) : (
              <p>Nothing found</p>
            )}
          </div>
        )}
      </div>

    );
  }
        

  /*
           {searchResults.length > 0 ? (
            searchResults.map((detail, index) => (
              <div key={index}>
                <p>Name: {detail.first_name} {detail.last_name}</p>
                <p>Email: {detail.email}</p>
                <p>Floor: {detail.floor}</p>
                <p> {detail.itemCount} {item}(s)</p>
                <button onClick={() => handleBorrowRequest(detail)}>Can I borrow ?</button>
                
              </div>
            ))
          ) : (
            <p>No one has this item in the house.</p>
          )}
       */ 