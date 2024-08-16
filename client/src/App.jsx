import './App.css';
import Home from './components/Home';
import Ihave from './components/Ihave';
import Ineed from './components/Ineed';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  
  return (
    <>
      
      <h1>Text</h1>

      <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/Ihave">Ihave</Link>
      <Link to="/Ineed">Ineed</Link>
      </div>
      <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/Ihave" element = {<Ihave />} />
      <Route path = "/Ineed" element = {<Ineed />} />
      </Routes>
      
    </>
  );
}

export default App
