import React, { useState} from "react";
import { useNavigate } from "react-router-dom";


export default function Ineed(){
    const [searchTerm, setSearchTerm] = useState("");
    const navigate =useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        navigate(`/search/${searchTerm}`);
    };


    return (
    <div>
        <h2>I need</h2>
        <form onSubmit={handleSubmit}>
        <input
        type="text"
        placeholder="What do you need?"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
        </form>
        </div>
    );
}