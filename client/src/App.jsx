import './App.css';
import Ihave from './components/Ihave';
import Ineed from './components/Ineed';
import SearchResults from "./components/SearchResults";
import ItemDetails from "./components/ItemDetails";
import BorrowStatus from "./components/BorrowStatus";
import UserItemForm from "./components/UserItemForm";
import Ireturn from "./components/Ireturn";
import Home from "./components/Home";
import { Routes, Route, Link } from 'react-router-dom';
import Login from "./components/Login.jsx";

function App() {
  return (
    <>
      
      <h1>Borrow Stuff</h1>

      <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/Ihave">I have</Link>
      <Link to="/Ineed">I need</Link>
      <Link to="/Ireturn">I Return</Link>
      <Link to="/login">Login</Link>
      </div>
      <Routes>
        <Route path = "/" element = {<Home/>} />
        <Route path = "/Ihave" element = {<Ihave />} />
        <Route path = "/Ineed" element = {<Ineed />} />
        <Route path = "/Ireturn" element = {<Ireturn/>} />
        <Route path="/login" element={<Login />} />
        <Route path= "/search/:item" element={<SearchResults />} />
        <Route path="/details/:item" element={<ItemDetails />} /> 
        <Route path="/borrow/:id" element={<BorrowStatus />} />
        <Route path="./UserItemForm" element={<UserItemForm />} />
      </Routes>
    </>
  );
}

export default App
