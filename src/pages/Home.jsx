import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [listOfPosts, setListOfPosts]=useState([]);

  const {authState}=useContext(AuthContext);


  const getUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  let navigate=useNavigate();
  const hasRedirected = useRef(false);

  useEffect (() =>{
    if(!authState.state && !hasRedirected.current){
      
      hasRedirected.current = true;
      alert("You have to login first");
      navigate('/login');
    }else{
      hasRedirected.current = false;
      axios.get("http://localhost:3006/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) =>{
        setListOfPosts(response.data);
      });
    }
  },[authState, navigate]);

  const likeAPost = (PostId) => {
    axios.post(
      "http://localhost:3006/like", 
      { PostId: PostId }, 
      { 
        headers: { 
          accessToken: localStorage.getItem('accessToken')
        }, 
      }
    ).then((response) => {
      setListOfPosts(listOfPosts.map((post) => {
        if(post.id === PostId){
          if(response.data.liked){
            return {...post, Likes: [...post.Likes, {UserId: userId}]};
          }
          else{
            const likesArray=post.Likes;
            likesArray.pop();
            return {...post, Likes: likesArray}
          }
          
        }
        else{
          return post;
        }
      }))
    } )
  }

  return (
    <>
      <div>
        {listOfPosts.map((value, key) => {
          const isLiked = value.Likes.some((like) => like.UserId === userId);
          return(
            <>
            <div className="post" key={key} >
              <div className="title">
                {value.title}
                
              </div>
              <div className="postText" >
                <div className='Post'>{value.postText}</div>
                <span className='comment-icon' onClick={() => navigate(`/post/${value.id}`)} style={{ cursor: 'pointer' }}>🗨️</span>
              </div>
              
              <div className="footer">
                <Link to={`/profile/${value.UserId}`} >{value.username}👤</Link> 
                <button onClick={
                  () => {likeAPost(value.id)}
                }>{isLiked ? '❤️' : '🤍' }</button>
                <label>Likes: {value.Likes.length}</label>
              </div>
            </div>
            <br />
            </>
          )
        })}
      </div>
    </>
  )
}

export default Home