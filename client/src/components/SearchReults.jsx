import React, { useEffect, useState} from "react";
import {useParams} from "react-router-dom";


export default function SearchResults() {
    const {item} = useParams();
    const [searchResults, setSearchResults] = useState(null);


    useEffect(() => {
        fetch('http://localhost:4000/search/${item}')
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
            <p>Item Found: {searchResults.item}</p>
            
          </div>
        )}
      </div>
    );
  }
        