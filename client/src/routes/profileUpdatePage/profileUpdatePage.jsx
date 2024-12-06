import "./profileUpdatePage.scss";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";

function ProfileUpdatePage() {
  const navigate = useNavigate();
  const [error,setErorr] = React.useState("");

  const {updateUser,currentUser} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErorr("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try{

      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password
      });

      updateUser(res.data);
      navigate("/profile");
     //console.log(res.data);
      

    }catch(err){
      console.log(err);
      setErorr(err.response?.data?.message);
    }
  }


  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password"  />
          </div>
          <button>Update</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={currentUser.avatar || "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"} alt="" className="avatar" />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
