import "./register.scss";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [err,setErr] = React.useState("");
  const [load,setLoad] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e)=>{

    e.preventDefault();
    setLoad(true);

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try{

      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password
      });
    
      navigate("/login");
    } catch(err){
      setErr(err.response?.data?.message);
      console.log(err);
    } finally{
      setLoad(false);
    }



  };

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={load}>Register</button>
          {err && <span>{err}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
