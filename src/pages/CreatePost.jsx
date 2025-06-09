import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import '../styles/CreatePost.css';
import { useContext, useEffect, useRef } from 'react';


const CreatePost = () => {

  const {authState}=useContext(AuthContext);
  
  let navigate=useNavigate();
  const alerted = useRef(false);
  const initialValues = {
    title: '',
    postText: ''
  }; 

  useEffect (() => {
    if(authState.username === "" && !alerted.current){
      alert("You have to login first before create a Post");
      alerted.current=true;
      navigate('/login');
    }
  }, [authState.username]);

  const validationSchema=Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  })

  const onSubmit = (data) => {
    const postData = { ...data, username: authState.username };
    axios.post("http://localhost:3006/posts", postData, {
      headers: {
        accessToken: localStorage.getItem("accessToken")
      }
    }).then((response) =>{
      navigate('/');
    });
  };

  return (
    <>
      <div className="createPostPage">
        <Formik initialValues={initialValues} onSubmit={onSubmit}  validationSchema={validationSchema}>
          <Form>
            <label>Title: </label>
            <Field 
              autoComplete="off" 
              id="inputCreatePost" 
              name="title" 
              placeholder="Enter the title" 
            />
            <ErrorMessage name="title" component="div" />

            <label>Post: </label>
            <Field 
              autoComplete="off"
              id="inputCreatePost" 
              name="postText" 
              placeholder="Enter the Text of the Post" 
            />
            <ErrorMessage name="postText" component="div" />

            <button type='submit'>Create Post</button>
          </Form>
        </Formik>
      </div>
    </>
  )
}

export default CreatePost