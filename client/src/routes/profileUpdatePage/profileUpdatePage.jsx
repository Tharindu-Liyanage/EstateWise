import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./profileUpdatePage.scss";

function ProfileUpdatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { updateUser, currentUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const [isWidgetOpen, setWidgetOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        avatar:avatar[0],
      });

      updateUser(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message);
    }
  };

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
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={
            avatar[0] || currentUser.avatar || "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
          }
          alt=""
          className="avatar"
        />
        <UploadWidget

          uwConfig={{
            cloudName: "dboywel2f",
            uploadPreset: "estateWise",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}

          setState={setAvatar}
          
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
