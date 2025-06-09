import './App.css';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import PageNotFound from './pages/PageNotFound';
import ChangePassword from './pages/ChangePassword';
import { AuthContext } from './helpers/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    state: false,
  });

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3006/auth/auth', {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ username: "", id: 0, state: false });
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          state: true,
        });
      }
      
    })
    .catch((error) => {
      console.error("Auth check failed:", error);
      setAuthState({ username: "", id: 0, state: false });
    })
    .finally(() => {
      setAuthLoading(false);
    });
  }, []);

  if (authLoading) return <div>Loading...</div>;

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <div className="navbar">
        {!authState.state ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/registration">Registration</Link>
          </>
        ) : (
          <>
            <Link to="/">Home Page</Link>
            <Link to="/createpost">Create a Post</Link>
            <LogoutButton setAuthState={setAuthState} />
          </>
        )}
        <h1>{authState.username}</h1>
      </div>

      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </AuthContext.Provider>
    </>
  );
}

function LogoutButton({ setAuthState }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      state: false,
    });
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default App;


