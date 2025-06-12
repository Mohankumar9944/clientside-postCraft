import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Profile.css';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';


const Profile = () => {
  const navigate=useNavigate();

  let {id}=useParams();
  const [username, setUserName]=useState("");
  const [listOfPosts, setListOfPosts]=useState([]);
  const {authState}=useContext(AuthContext);

  useEffect(() => {
    axios.get(`https://serverside-postcraft.onrender.com/auth/basicInfo/${id}`).then((response) => {
        setUserName(response.data.username);
    });

    axios.get(`https://serverside-postcraft.onrender.com/posts/byuserId/${id}`).then((response) => {
        setListOfPosts(response.data);
    })

  }, [id]);

  return (
    <>
      <div className="profilePageContainer">
        <div className="basicInfo">
            <h1>👤{username}</h1>
            { authState.username === username && (
              <button className="password-button" onClick={() => navigate("/changepassword")} >Change password</button>
            )}
        </div>
        <div className="listOfPosts">
            {listOfPosts.map((value, key) => {
                return(
                    <>
                        <div className="post" key={key} >
                            <div className="title">
                                {value.title}
                            </div>
                            <div className="postContent">
                              <div className="content" >
                                {value.postText}
                              </div>
                              <button className='comment-icons' onClick={() => navigate(`/post/${value.id}`)} style={{ cursor: 'pointer' }}>🗨️</button>
                            </div>
                            <label>Likes: {value.Likes.length}</label>
                        </div>
                    </>
                )
            })}
        </div>
      </div>
    </>
  )
}

export default Profile;