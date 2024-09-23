import {useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {
    // State for managing login info
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

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
    const login = async () => {
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
    };

    // MOVE THIS TO HOME PAGE
    const requestData = async () => {
        try {
          const { data } = await axios("/api/users/profile", {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          setMessage(data.message);
          console.log(data.message);
        } catch (error) {
          console.log(error);
          setMessage(error.message);
        }
    };

    return (
        <div>
        <div>
          <input
            value={email}
            onChange={handleChange}
            name="email"
            type="text"
            className="form-control mb-2"
          />
          <input
            value={password}
            onChange={handleChange}
            name="password"
            type="password"
            className="form-control mb-2"
          />
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-primary" onClick={login}>
              Log in
            </button>
            <button className="btn btn-outline-dark ml-2" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
        <div className="text-center p-4">
          <button className=" btn btn-outline-primary" onClick={requestData}>
            Request protected data
          </button>
        </div>
  
        {message && (
          <div className="text-center p-4">
            <div className="alert">{message}</div>
          </div>
        )}
      </div>
    );
}

export default Login;