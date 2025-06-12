import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate=useNavigate();


  const changePassword = () => {
    axios.put("https://serverside-postcraft.onrender.com/auth/changepassword", { 
        oldPassword: oldPassword, 
        newPassword: newPassword
    }, 
    {
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
    }
    ).then((response) => {
        if(response.data.error){
            alert(response.data.error)
        }
        else{
            alert("Password Updated Successfully");
            navigate("/");
        }

    } );
  }


  return (
    
    <>
      <div className="change-password-container">
        <h1>Change Password</h1>
        <label >Current Password: </label>
        <input 
          type="password" 
          placeholder='Enter your Old Password' 
          onChange={(event) => { 
            setOldPassword(event.target.value)
          }}
        />
        <br />
        <label >New Password: </label>
        <input 
          type="password" 
          placeholder='Enter your new Password'
          onChange={(event) => { 
            setNewPassword(event.target.value)
          }}
        />
        <br />
        <button onClick={changePassword} >Save Changes</button>

      </div>
    </>
  )
}

export default ChangePassword