import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { AuthContext } from '../helpers/AuthContext';

const Login = () => {
  let navigate=useNavigate();
  const [username, setUsername]=useState("");
  const [password, setPassword]=useState("");
  const [message, setMessage] = useState('');
  const {setAuthState}=useContext(AuthContext);

  const login = () => {
    const data={ username : username, password : password };
    axios.post("https://serverside-postcraft.onrender.com/auth/login", data).then((response) =>{
        if (response.data.error) {
            setMessage(response.data.error);
            setUsername('');
            setPassword('');
        } 
        else {
            localStorage.setItem("accessToken", response.data.token);
            setMessage('✅ Login successful!');
            setUsername('');
            setPassword('');
            alert('✅ Login successful!');
            setAuthState({
              username: response.data.username,
              id: response.data.id,
              state: true,
            });
            navigate('/');
        }

    })
    .catch(err => {
      console.log("Login error:", err);  // See this in your browser console
      const errorMsg = err.response?.data?.error || "An error occurred. Please try again.";
      setMessage(errorMsg);
    });
  }
  return (
    <>
      <div className="login-page-wrapper">
        <div className='login-form'>
          <h2>Login</h2>
          <label htmlFor="username">Username:</label>
          <input 
              type="text" 
              id="username" 
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)} 
          />
          <label htmlFor="password">Password:</label>
          <input 
              type="password" 
              id="password" 
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)} 
          />
          <button onClick={login}>Login</button>
          {message && <p className="message">{message}</p>}

        </div>
      </div>
    </>
  )
}

export default Login