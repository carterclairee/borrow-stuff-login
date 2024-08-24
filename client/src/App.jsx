import './App.css';
import Home from './components/Home';
import Ihave from './components/Ihave';
import Ineed from './components/Ineed';
import SearchResults from "./components/SearchResults";
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  
  return (
    <>
      
      <h1>Text</h1>

      <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/Ihave">I have</Link>
      <Link to="/Ineed">I need</Link>
      </div>
      <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/Ihave" element = {<Ihave />} />
      <Route path = "/Ineed" element = {<Ineed />} />
      <Route path="/search/:item" element={<SearchResults />} />
      </Routes>
      
    </>
  );
}

export default App
