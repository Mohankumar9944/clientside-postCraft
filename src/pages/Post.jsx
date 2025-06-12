import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';
import '../styles/Post.css';
import { AuthContext } from '../helpers/AuthContext';


const Post = () => {
  const [postObject, setPostObject] =useState({});
  const [comments, setComments]=useState([]);
  const [newComment, setNewCommment]=useState("");
  const {authState}=useContext(AuthContext);
  let {id}=useParams();
  const navigate=useNavigate();

  useEffect(() => {
    axios.get(`https://serverside-postcraft.onrender.com/posts/byId/${id}`).then((response) =>{
      setPostObject(response.data);
    });
    axios.get(`https://serverside-postcraft.onrender.com/comments/${id}`).then((response) =>{
      setComments(response.data);
    });
  },[id]);

  const addComment = () =>{
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    axios
      .post("https://serverside-postcraft.onrender.com/comments", {
        commentBody: newComment, 
        PostId: id
      },
      {
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      }
      
      )
      .then((response) =>{
        if (response.data.error) {
          const err = response.data.error;
          const message = typeof err === 'string' ? err : err.message || JSON.stringify(err);
          alert(message);
        }
        else{
          setComments([...comments, response.data]);
          setNewCommment("");
        }
      }
    )
  }

  const deleteComment = (id) => {
    axios.delete(`http://https://serverside-postcraft.onrender.com/comments/${id}`, {
      headers:{
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then(() => {
      setComments(prev => prev.filter((comment) => comment.id !== id));
    })
  }

  const deletePost = (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    axios.delete(`https://serverside-postcraft.onrender.com/posts/${id}`, {
      headers:{
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then(() => {
      alert("Post deleted successfully.");
      navigate("/", { replace: true });
    })
  }

  const editPost = (option) => {
    if(option==='title'){
      let newTitle=prompt("Enter New Title: ");
      if (!newTitle || !newTitle.trim()) return;
      axios.put(
        "https://serverside-postcraft.onrender.com/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers:{
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject({...postObject, title: newTitle});
    }else{
      let newPostText=prompt("Enter New Text Of the Post: ");
      if (!newPostText || !newPostText.trim()) return;
      axios.put(
        "https://serverside-postcraft.onrender.com/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers:{
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject({...postObject, postText: newPostText});
    }
  }

  return (
    <>
      <div className="postPage">
        <div className="leftside">
            <div className="post" id="individual">
              <div className="title"  >
                {postObject.title}
                <button onClick={() => {
                  if(authState.username===postObject.username){
                    editPost("title");
                  }
                }}
              >✏️</button>
              </div>
              <div className="postText">
                {postObject.postText}
                <button className="postText" onClick={() => {
                  if(authState.username===postObject.username){
                    editPost("postText");
                  }
                }} >✏️</button>
              </div>
              <div className="username">{postObject.username} {authState.username===postObject.username && <button onClick={() => {deletePost(postObject.id)}}>🗑️</button> } </div>
            </div>
        </div>
        <div className="rightside">
          <div className="addCommentContainer">
            <input 
              type="text" 
              placeholder="Comment..." 
              autoComplete="off" 
              value={newComment}
              onChange={(event) => {
                setNewCommment(event.target.value)
              }}
            />
            <button onClick={addComment}>➕</button>
          </div>
          <div>{comments.length === 0 ? (<h1>No Comments yet</h1>) : (<h1>Comments: </h1>)}</div>
          <div className="listOfComments">
            {comments.map((comment) =>{
              return(
                <div className="comment" key={comment.id}>
                  {comment.commentBody}
                  <br />
                  <label>{comment.username}👤</label>
                  {authState.username === comment.username && (
                    <button onClick={() => deleteComment(comment.id)} >🗑️</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Post