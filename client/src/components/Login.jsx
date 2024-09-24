import {useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {
    // State for managing login info
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    // State to check whether user has logged out
    const [loggedOut, setLoggedOut] = useState(false);

    // To navigate to home after successful login
    const navigate = useNavigate();

    // State for storing messages from axios call
    const [message, setMessage] = useState(null);

    // Variables for using credentials more efficiently
    const { email, password } = credentials;

    // Function for getting user entered values
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({...credentials, [name]: value});
    };

    // Fetch login with axios
    const login = async (e) => {
        e.preventDefault();

        try {
            // Post username and password
            const { data } = await axios("/api/users/login", {
                method: "POST",
                data: credentials,
            });

            // Store the token locally
            localStorage.setItem("token", data.token);
            // Go to home view upon login
            navigate('/')
        } catch (error) {
            setMessage(error.message);
        }
    };

    // Remove token upon logout
    const logout = () => {
        localStorage.removeItem("token");
        // Set the logged out state to true to display login message
        setLoggedOut(true);
    };

    return (
        <>
        {/* Show message if user logs out */}
        {loggedOut && (
          <div className="text-center p-4 alert">You've been logged out. Please log in to start borrowing and sharing.</div>
        )}

        {/* Display login prompt if no token */}
          {!localStorage.getItem("token") && !loggedOut && (
          <div className="text-center p-4 alert">Please log in to start borrowing and sharing.</div>
        )}

        <form onSubmit={login}>
        <div className="form-floating mb-3">
          <input
            value={email}
            onChange={handleChange}
            name="email"
            type="email"
            className="form-control" 
            id="floatingInput1" 
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput1">Email address</label>
          </div>

        <div className="form-floating mb-3">
          <input
            value={password}
            onChange={handleChange}
            name="password"
            type="password"
            className="form-control" 
            id="floatingInput2" 
            placeholder="name@example.com"
          />
        <label htmlFor="floatingInput1">Password</label>
        </div>

          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-dark">
              Log in
            </button>
          </div>
        </form>

        <button className="btn btn-outline-dark mt-4" onClick={logout}>
        Log out
        </button>
  
        {message && (
          <div className="text-center p-4">
            <div className="alert">{message}</div>
          </div>
        )}
      </>
    );
}

export default Login;