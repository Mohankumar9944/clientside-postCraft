import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import '../styles/Registration.css';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    let navigate=useNavigate();
    const initialValues = {
      username: '',
      password: ''
    }; 
  
    const validationSchema=Yup.object().shape({
      username: Yup.string().min(6).max(15).required(),
      password: Yup.string().min(6).max(15).required(),
    })

    const onSubmit = (data, {resetForm}) =>{
        axios.post("https://serverside-postcraft.onrender.com/auth", data).then((response) => {
            alert("Registration successful!");
            navigate('/login');
            resetForm();

        })

    }
  
  return (
    <>
      <div className='register-heading'>Register</div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}  validationSchema={validationSchema}>
          
          <Form className="registration-form">
            <label htmlFor="username">Username: </label>
            <Field 
              autoComplete="off" 
              id="username"
              name="username" 
              placeholder="username" 
            />
            <ErrorMessage name="username" component="div" className="error"/>

            <label htmlFor="password">Password: </label>
            <Field 
              autoComplete="off" 
              id="password" 
              type="password"
              name="password" 
              placeholder="Enter Password" 
            />
            <ErrorMessage name="password" component="div" className="error"/>

            <button type='submit'>Register</button>
          </Form>
        </Formik>
    </>
  )
}

export default Registration